import type { CartItem } from "@/lib/cart";
import { normalizePhoneForWhatsApp } from "@/lib/utils";

interface CustomerOrder {
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
}

interface WhatsAppOrderMessageInput {
  orderId?: string;
  storeName?: string;
  customer: CustomerOrder;
  items: CartItem[];
  total: number;
  currency: string;
  orderDate?: Date;
}

export function buildOrderMessage({
  orderId,
  storeName = "WQITAK",
  customer,
  items,
  total,
  currency,
  orderDate = new Date()
}: WhatsAppOrderMessageInput) {
  const products = items
    .map(
      (item) =>
        `• ${item.name}\n  Qty: ${item.quantity}\n  Total: ${item.price * item.quantity} ${currency}`
    )
    .join("\n\n");

  return [
    `⌚ ${storeName} Order`,
    orderId ? `🧾 Order ID: ${orderId}` : "",
    "",
    "👤 Customer",
    `Name: ${customer.customer_name}`,
    `Phone: ${customer.customer_phone}`,
    `City: ${customer.customer_city}`,
    customer.customer_address ? `Address: ${customer.customer_address}` : "",
    "",
    "🛍️ Products",
    products,
    "",
    `💰 Total: ${total} ${currency}`,
    "💵 Payment: Cash on delivery",
    `📅 Date: ${orderDate.toLocaleString()}`
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildDirectProductOrderMessage({
  storeName = "WQITAK",
  orderId,
  productName,
  quantity,
  price,
  total,
  currency,
  customer
}: {
  storeName?: string;
  orderId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  currency: string;
  customer: CustomerOrder;
}) {
  return [
    `⌚ ${storeName} Order`,
    `🧾 Order ID: ${orderId}`,
    "",
    "👤 Customer",
    `Name: ${customer.customer_name}`,
    `Phone: ${customer.customer_phone}`,
    `City: ${customer.customer_city}`,
    customer.customer_address ? `Address: ${customer.customer_address}` : "",
    "",
    "🛍️ Product",
    `Name: ${productName}`,
    `Quantity: ${quantity}`,
    `Unit price: ${price} ${currency}`,
    "",
    `💰 Total: ${total} ${currency}`,
    "💵 Payment: Cash on delivery"
  ]
    .filter(Boolean)
    .join("\n");
}

export function createWhatsAppUrl(phone: string, message: string) {
  const normalizedPhone = normalizePhoneForWhatsApp(phone);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
