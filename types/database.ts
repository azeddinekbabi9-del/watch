export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StockStatus = "available" | "out_of_stock";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  gallery_images: string[] | null;
  category_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  stock_status: StockStatus;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_access_token: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  customer_notes: string | null;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  order_access_token: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  logo_url: string | null;
  main_color: string;
  currency: string;
  store_phone: string | null;
  store_description: string | null;
  admin_whatsapp_phone: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  delivery_text: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  show_featured_products: boolean;
  show_categories: boolean;
  show_benefits: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductWithCategory = Product & {
  categories: Category | null;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

export interface TrackOrderResult {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string | null;
  customer_notes: string | null;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  order_items: Json;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      categories: Table<Category>;
      products: Table<Product>;
      orders: Table<Order>;
      order_items: Table<OrderItem>;
      store_settings: Table<StoreSettings>;
    };
    Views: Record<string, never>;
    Functions: {
      track_order: {
        Args: {
          lookup_order_id?: string;
          lookup_customer_phone?: string;
        };
        Returns: TrackOrderResult[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
