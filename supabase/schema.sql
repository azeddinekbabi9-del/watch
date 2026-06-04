create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  old_price numeric(12, 2) check (old_price is null or old_price >= 0),
  image_url text,
  gallery_images text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  stock_status text not null default 'available'
    check (stock_status in ('available', 'out_of_stock')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_access_token text not null default encode(gen_random_bytes(16), 'hex'),
  customer_name text not null,
  customer_phone text not null,
  customer_city text not null,
  customer_address text not null,
  customer_notes text,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_access_token text not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  total_price numeric(12, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

alter table public.orders
add column if not exists order_access_token text not null default encode(gen_random_bytes(16), 'hex');

alter table public.order_items
add column if not exists order_access_token text not null default encode(gen_random_bytes(16), 'hex');

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'VQ Watches',
  logo_url text,
  main_color text not null default '#11100e',
  currency text not null default 'MAD',
  store_phone text,
  store_description text,
  admin_whatsapp_phone text not null default '',
  hero_title text not null default 'Luxury timepieces for quiet confidence',
  hero_subtitle text not null default 'Discover refined watches, premium straps, and elegant accessories with effortless WhatsApp ordering.',
  hero_image_url text,
  delivery_text text not null default 'Premium delivery with careful packaging and WhatsApp confirmation.',
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  show_featured_products boolean not null default true,
  show_categories boolean not null default true,
  show_benefits boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_settings
add column if not exists store_phone text;

alter table public.store_settings
add column if not exists store_description text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

create index if not exists idx_categories_active_slug on public.categories(is_active, slug);
create index if not exists idx_products_active_featured on public.products(is_active, is_featured);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_stock_status on public.products(stock_status);
create index if not exists idx_orders_status_created_at on public.orders(status, created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

create or replace function public.can_insert_order_item(
  target_order_id uuid,
  target_order_access_token text
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders
    where id = target_order_id
      and order_access_token = target_order_access_token
  );
$$;

grant execute on function public.can_insert_order_item(uuid, text) to anon, authenticated;

drop function if exists public.track_order(uuid, text);
drop function if exists public.track_order(text, text);
create function public.track_order(
  lookup_order_id text default null,
  lookup_customer_phone text default null
)
returns table (
  id uuid,
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
    orders.id = case
      when lookup_order_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then lookup_order_id::uuid
      else null
    end
  )
  or (
    nullif(lookup_customer_phone, '') is not null
    and nullif(regexp_replace(lookup_customer_phone, '\D', '', 'g'), '') is not null
    and regexp_replace(orders.customer_phone, '\D', '', 'g')
      = regexp_replace(lookup_customer_phone, '\D', '', 'g')
  )
  group by orders.id
  order by orders.created_at desc;
$$;

grant execute on function public.track_order(text, text) to anon, authenticated;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (true)
with check (true);

drop policy if exists "Customers can create orders" on public.orders;
create policy "Customers can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read and update orders" on public.orders;
create policy "Admins can read and update orders"
on public.orders for all
to authenticated
using (true)
with check (true);

drop policy if exists "Customers can create order items" on public.order_items;
create policy "Customers can create order items"
on public.order_items for insert
to anon, authenticated
with check (public.can_insert_order_item(order_id, order_access_token));

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items"
on public.order_items for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings"
on public.store_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admins can update store settings" on public.store_settings;
create policy "Admins can update store settings"
on public.store_settings for all
to authenticated
using (true)
with check (true);

insert into public.store_settings (
  store_name,
  logo_url,
  main_color,
  currency,
  store_phone,
  store_description,
  admin_whatsapp_phone,
  hero_title,
  hero_subtitle,
  hero_image_url,
  delivery_text
)
select
  'VQ Watches',
  '/watch-logo.png',
  '#11100e',
  'MAD',
  '+212 600 000 000',
  'A refined Moroccan watch store for curated timepieces, straps, and elegant accessories.',
  '',
  'Luxury timepieces for quiet confidence',
  'Discover refined watches, premium straps, and elegant accessories with effortless WhatsApp ordering.',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1600&q=80',
  'Premium delivery with careful packaging and WhatsApp confirmation.'
where not exists (select 1 from public.store_settings);
