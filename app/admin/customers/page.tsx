import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCustomersFromOrders, getStoreSettings } from "@/lib/data";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const [customers, settings] = await Promise.all([
    getCustomersFromOrders(),
    getStoreSettings()
  ]);

  return (
    <div className="page-transition space-y-6">
      <div className="hero-reveal">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Customers
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Customer history</h2>
      </div>

      {customers.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-gold/15 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-ink/5 text-xs uppercase tracking-[0.12em] text-ink/55">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total spent</th>
                  <th className="px-4 py-3">Last order</th>
                  <th className="px-4 py-3">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {customers.map((customer) => (
                  <tr key={customer.customer_phone}>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {customer.customer_name}
                    </td>
                    <td className="px-4 py-3 text-ink/65">
                      {customer.customer_phone}
                    </td>
                    <td className="px-4 py-3 text-ink/65">
                      {customer.customer_city}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {customer.order_count}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {formatPrice(customer.total_spent, settings.currency)}
                    </td>
                    <td className="px-4 py-3 text-ink/65">
                      {new Date(customer.last_order_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={createWhatsAppUrl(
                          customer.customer_phone,
                          `Hello ${customer.customer_name}, thank you for shopping with ${settings.store_name}.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-gold/20 text-ink transition-colors duration-300 hover:bg-gold hover:text-ink"
                        aria-label="Message customer on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No customers yet"
          description="Customers will appear here automatically after orders are created."
          className="bg-cream"
        />
      )}
    </div>
  );
}
