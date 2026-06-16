alter table public.store_settings
add column if not exists store_phone text;

alter table public.store_settings
add column if not exists store_description text;

update public.store_settings
set
  logo_url = coalesce(logo_url, '/watch-logo.png'),
  main_color = coalesce(main_color, '#11100e'),
  store_phone = coalesce(store_phone, '+212 600 000 000'),
  store_description = coalesce(
    store_description,
    'A refined Moroccan watch store for curated timepieces, straps, and elegant accessories.'
  )
where true;

drop function if exists public.track_order(uuid, text);
drop function if exists public.track_order(text, text);

create function public.track_order(
  lookup_order_id text default null,
  lookup_customer_phone text default null
)
returns table (
  id uuid,
  order_code text,
  customer_name text,
  customer_phone text,
  customer_city text,
  customer_address text,
  customer_notes text,
  total_amount numeric,
  status text,
  created_at timestamptz,
  order_items jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    orders.id,
    orders.order_code,
    orders.customer_name,
    orders.customer_phone,
    orders.customer_city,
    nullif(orders.customer_address, '') as customer_address,
    nullif(orders.customer_notes, '') as customer_notes,
    orders.total_amount,
    orders.status,
    orders.created_at,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'product_name', order_items.product_name,
          'quantity', order_items.quantity,
          'unit_price', order_items.unit_price,
          'total_price', order_items.total_price
        )
        order by order_items.created_at
      ) filter (where order_items.id is not null),
      '[]'::jsonb
    ) as order_items
  from public.orders
  left join public.order_items on order_items.order_id = orders.id
  where (
    nullif(lookup_order_id, '') is not null
    and (
      orders.id = case
        when lookup_order_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          then lookup_order_id::uuid
        else null
      end
      or upper(coalesce(orders.order_code, '')) = upper(lookup_order_id)
    )
  )
  or (
    nullif(lookup_customer_phone, '') is not null
    and nullif(regexp_replace(lookup_customer_phone, '\D', '', 'g'), '') is not null
    and regexp_replace(orders.customer_phone, '\D', '', 'g')
      = regexp_replace(lookup_customer_phone, '\D', '', 'g')
  )
  group by orders.id, orders.order_code
  order by orders.created_at desc;
$$;

grant execute on function public.track_order(text, text) to anon, authenticated;
