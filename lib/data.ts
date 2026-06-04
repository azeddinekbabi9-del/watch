import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseConfig } from "@/lib/config";
import type {
  Category,
  Order,
  OrderWithItems,
  ProductWithCategory,
  StoreSettings
} from "@/types/database";

const now = new Date().toISOString();

export const demoSettings: StoreSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  store_name: "VQ Watches",
  logo_url: "/watch-logo.png",
  main_color: "#11100e",
  currency: "MAD",
  store_phone: "+212 600 000 000",
  store_description:
    "A refined Moroccan watch store for curated timepieces, straps, and elegant accessories.",
  admin_whatsapp_phone: "212600000000",
  hero_title: "Luxury timepieces for quiet confidence",
  hero_subtitle:
    "Discover refined watches, premium straps, and elegant accessories with effortless WhatsApp ordering.",
  hero_image_url:
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1600&q=80",
  delivery_text: "Premium delivery with careful packaging and WhatsApp confirmation.",
  facebook_url: null,
  instagram_url: null,
  tiktok_url: null,
  show_featured_products: true,
  show_categories: true,
  show_benefits: true,
  created_at: now,
  updated_at: now
};

export const demoCategories: Category[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    name: "Automatic Watches",
    slug: "automatic-watches",
    description: "Mechanical watches with timeless detail.",
    image_url:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    is_active: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    name: "Dress Watches",
    slug: "dress-watches",
    description: "Slim, polished pieces for formal moments.",
    image_url:
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=80",
    is_active: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    name: "Straps & Cases",
    slug: "straps-cases",
    description: "Leather straps, travel rolls, and refined care.",
    image_url:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80",
    is_active: true,
    created_at: now,
    updated_at: now
  }
];

export const demoProducts: ProductWithCategory[] = [
  {
    id: "00000000-0000-0000-0000-000000000201",
    name: "VQ Heritage Automatic",
    slug: "vq-heritage-automatic",
    description:
      "A refined automatic watch with a warm dial, polished case, and a leather strap.",
    price: 2490,
    old_price: 2990,
    image_url:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80"
    ],
    category_id: demoCategories[0].id,
    categories: demoCategories[0],
    is_featured: true,
    is_active: true,
    stock_status: "available",
    created_at: now,
    updated_at: now
  },
  {
    id: "00000000-0000-0000-0000-000000000202",
    name: "Noir Dress Watch",
    slug: "noir-dress-watch",
    description:
      "A minimal black dress watch designed for evening wear and quiet elegance.",
    price: 1890,
    old_price: null,
    image_url:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80",
    gallery_images: [],
    category_id: demoCategories[1].id,
    categories: demoCategories[1],
    is_featured: true,
    is_active: true,
    stock_status: "available",
    created_at: now,
    updated_at: now
  },
  {
    id: "00000000-0000-0000-0000-000000000203",
    name: "Leather Watch Roll",
    slug: "leather-watch-roll",
    description:
      "A soft leather travel roll for keeping your timepieces protected in transit.",
    price: 690,
    old_price: 790,
    image_url:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80",
    gallery_images: [],
    category_id: demoCategories[2].id,
    categories: demoCategories[2],
    is_featured: false,
    is_active: true,
    stock_status: "available",
    created_at: now,
    updated_at: now
  }
];

function configured() {
  return getSupabaseConfig().isConfigured;
}

export async function getStoreSettings() {
  if (!configured()) {
    return demoSettings;
  }

  const supabase: any = createSupabaseServerClient();
  const { data } = await supabase
    .from("store_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (data as StoreSettings | null) ?? demoSettings;
}

export async function getCategories(activeOnly = true) {
  if (!configured()) {
    return activeOnly
      ? demoCategories.filter((category) => category.is_active)
      : demoCategories;
  }

  const supabase: any = createSupabaseServerClient();
  let query: any = supabase.from("categories").select("*").order("name");

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data } = await query;
  return (data ?? []) as Category[];
}

interface ProductFilters {
  activeOnly?: boolean;
  featuredOnly?: boolean;
  categorySlug?: string;
}

export async function getProducts({
  activeOnly = true,
  featuredOnly = false,
  categorySlug
}: ProductFilters = {}) {
  if (!configured()) {
    return demoProducts.filter((product) => {
      if (activeOnly && !product.is_active) {
        return false;
      }
      if (featuredOnly && !product.is_featured) {
        return false;
      }
      if (categorySlug && product.categories?.slug !== categorySlug) {
        return false;
      }
      return true;
    });
  }

  const supabase: any = createSupabaseServerClient();
  let query: any = supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  if (featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    const selectedCategory: any = category;

    if (!selectedCategory?.id) {
      return [];
    }

    query = query.eq("category_id", selectedCategory.id);
  }

  const { data } = await query;
  return (data ?? []) as unknown as ProductWithCategory[];
}

export async function getProductBySlug(slug: string) {
  if (!configured()) {
    return demoProducts.find((product) => product.slug === slug) ?? null;
  }

  const supabase: any = createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .maybeSingle();

  return (data as unknown as ProductWithCategory | null) ?? null;
}

export async function getProductById(id: string) {
  if (!configured()) {
    return demoProducts.find((product) => product.id === id) ?? null;
  }

  const supabase: any = createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .maybeSingle();

  return (data as unknown as ProductWithCategory | null) ?? null;
}

export async function getOrders() {
  if (!configured()) {
    return [] as Order[];
  }

  const supabase: any = createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Order[];
}

export async function getOrderById(id: string) {
  if (!configured()) {
    return null;
  }

  const supabase: any = createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  return (data as unknown as OrderWithItems | null) ?? null;
}

export async function getDashboardStats() {
  const [products, categories, orders] = await Promise.all([
    getProducts({ activeOnly: false }),
    getCategories(false),
    getOrders()
  ]);

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter((order) => order.status === "delivered");
  const estimatedRevenue = orders
    .filter((order) => ["confirmed", "shipped", "delivered"].includes(order.status))
    .reduce((total, order) => total + Number(order.total_amount), 0);
  const totalCustomers = new Set(
    orders.map((order) => order.customer_phone.replace(/[^\d]/g, ""))
  ).size;

  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: orders.length,
    pendingOrders: pendingOrders.length,
    completedOrders: completedOrders.length,
    totalCustomers,
    estimatedRevenue,
    recentOrders: orders.slice(0, 6)
  };
}

export async function getCustomersFromOrders() {
  const orders = await getOrders();
  const customers = new Map<
    string,
    {
      customer_name: string;
      customer_phone: string;
      customer_city: string;
      order_count: number;
      total_spent: number;
      last_order_date: string;
    }
  >();

  orders.forEach((order) => {
    const key = order.customer_phone.replace(/[^\d]/g, "") || order.customer_phone;
    const existing = customers.get(key);
    const orderDate = new Date(order.created_at).getTime();
    const existingDate = existing
      ? new Date(existing.last_order_date).getTime()
      : Number.NEGATIVE_INFINITY;

    customers.set(key, {
      customer_name:
        existing && existingDate >= orderDate
          ? existing.customer_name
          : order.customer_name,
      customer_phone: order.customer_phone,
      customer_city:
        existing && existingDate >= orderDate ? existing.customer_city : order.customer_city,
      order_count: (existing?.order_count ?? 0) + 1,
      total_spent: (existing?.total_spent ?? 0) + Number(order.total_amount),
      last_order_date:
        existing && existingDate >= orderDate
          ? existing.last_order_date
          : order.created_at
    });
  });

  return Array.from(customers.values()).sort(
    (left, right) =>
      new Date(right.last_order_date).getTime() -
      new Date(left.last_order_date).getTime()
  );
}