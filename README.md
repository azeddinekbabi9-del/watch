# Cloudflare Supabase Store

A complete Next.js App Router watch-store foundation with a customer storefront, direct product ordering, WhatsApp order handoff, Supabase database schema, order tracking, and protected admin dashboard.

The storefront is styled as a premium watch store with warm cream, sand, black, and gold accents. UI sections, product cards, loading states, buttons, product-order interactions, and admin dashboard cards use subtle luxury animations. The logo is intentionally static and is not animated.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Database
- WhatsApp order links
- OpenNext Cloudflare adapter

## Local Setup

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
cp .dev.vars.example .dev.vars
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.dev.vars` only needs `NEXTJS_ENV=development` for local Worker previews.

Run locally:

```bash
npm run dev
```

Build locally:

```bash
npm run build
```

Without Supabase env vars, the storefront renders demo content and direct order forms prepare a demo WhatsApp flow. Real products, orders, admin auth, and settings work after Supabase is connected.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run the full schema in `supabase/schema.sql`.
4. Copy your project URL and anon public key into `.env.local`.
5. Restart `npm run dev`.

The schema creates:

- `products`
- `categories`
- `orders`
- `order_items`
- `store_settings`

It also enables RLS, creates customer read/insert policies, creates authenticated admin CRUD policies, adds indexes, timestamps, relationships, and inserts a default store settings row.

Order item inserts use a private `order_access_token` generated during direct product ordering. This lets the customer create items for the order they just created without granting public order read access.

Order tracking uses the `track_order` RPC. Customers can enter either their order ID or the phone number used for the order at `/track-order`. Phone matches can return multiple matching orders, and the response only includes limited order status data.

For an existing Supabase project, run `supabase/update-store-features.sql` after the original schema. It safely adds store phone/description fields and replaces the tracking RPC without deleting existing data or tables.

## Admin Account Setup

This project uses Supabase Auth for `/admin`.

1. In Supabase, go to Authentication > Users.
2. Create a user with email and password.
3. Visit `/admin/login`.
4. Sign in with that user.

Current admin policies allow any authenticated Supabase user to manage the store. For production, improve this by creating an `admin_users` table or custom JWT claim and updating the authenticated RLS policies to check that allowlist.

## Store Management

Admin routes:

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/categories`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/customers`
- `/admin/settings`

Anything major on the customer side is controlled from admin: products, categories, store name, colors, logo, store description, phone number, hero content, delivery text, social links, homepage section visibility, WhatsApp phone, and currency.

Customer routes include `/`, `/products`, `/products/[slug]`, and `/track-order`. `/cart` and `/checkout` redirect to `/products` because the customer flow uses direct product ordering only.

The default logo asset is `public/watch-logo.png`. Use it normally in the navbar, footer, and admin login; do not animate the logo.

## WhatsApp Orders

The product detail order form validates required fields, saves an order and order item to Supabase, builds a WhatsApp message, and opens a `wa.me` link to the admin phone from `store_settings`.

The message includes:

- Order ID
- Customer name and phone
- City and optional address
- Notes
- Product
- Quantity
- Total price

Use international phone format in admin settings, for example `212600000000`.

## Cloudflare Deployment

This project includes:

- `open-next.config.ts`
- `wrangler.toml`
- `public/_headers` for immutable Next static asset caching
- OpenNext Cloudflare scripts in `package.json`

Cloudflare build command for Workers or Pages with the OpenNext adapter:

```bash
npm run cf:build
```

Preview with Wrangler:

```bash
npm run cf:preview
```

Deploy with Wrangler:

```bash
npm run cf:deploy
```

If you manage environment variables in the Cloudflare dashboard, deploy with:

```bash
npm run cf:deploy:keep-vars
```

For Cloudflare, set these variables in both build variables and runtime environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Deployment settings:

- Build command: `npm run cf:build`
- Output/assets directory: `.open-next/assets`
- Worker entry: `.open-next/worker.js`
- Compatibility flags: `nodejs_compat`, `global_fetch_strictly_public`
- Static assets binding: `ASSETS`
- Service binding: `WORKER_SELF_REFERENCE` pointing to `cloudflare-supabase-store`

The app avoids direct Node.js server-only APIs. It uses Next.js runtime APIs, Supabase public anon key access, and browser-side admin CRUD through the authenticated Supabase session.

## Useful Commands

```bash
npm run dev
npm run build
npm run cf:build
npm run cf:preview
npm run cf:deploy
npm run cf:deploy:keep-vars
```
