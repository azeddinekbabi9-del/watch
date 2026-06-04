import type { CartItem } from "@/lib/cart";
import { normalizePhoneForWhatsApp } from "@/lib/utils";

interface CustomerOrder {
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  customer_notes?: string;
}

interface WhatsAppOrderMessageInput {
  orderId?: string;
  customer: CustomerOrder;
  items: CartItem[];
  total: number;
  currency: string;
  orderDate?: Date;
}

export function buildOrderMessage({
  orderId,
  customer,
  items,
  total,
  currency,
  orderDate = new Date()
}: WhatsAppOrderMessageInput) {
  const products = items
    .map(
      (item) =>
        `- ${item.name} x ${item.quantity} | ${item.price * item.quantity} ${currency}`
    )
    .join("\n");

  return [
    "New order",
    orderId ? `Order ID: ${orderId}` : "",
    "",
    `Customer: ${customer.customer_name}`,
    `Phone: ${customer.customer_phone}`,
    `City: ${customer.customer_city}`,
    `Address: ${customer.customer_address}`,
    `Notes: ${customer.customer_notes || "None"}`,
    "",
    "Products:",
    products,
    "",
    `Total: ${total} ${currency}`,
    `Order date: ${orderDate.toLocaleString()}`
  ].join("\n");
}

export function createWhatsAppUrl(phone: string, message: string) {
  const normalizedPhone = normalizePhoneForWhatsApp(phone);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
