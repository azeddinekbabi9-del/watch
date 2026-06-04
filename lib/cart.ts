import type { ProductWithCategory } from "@/types/database";

export const cartStorageKey = "cloudflare-supabase-store-cart";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_url: string | null;
  stock_status: string;
  category_name: string | null;
  quantity: number;
}

export function productToCartItem(
  product: ProductWithCategory,
  quantity = 1
): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image_url: product.image_url,
    stock_status: product.stock_status,
    category_name: product.categories?.name ?? null,
    quantity
  };
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
