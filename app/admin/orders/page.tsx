import { OrdersManager } from "@/components/admin/OrdersManager";
import { getOrders, getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const [orders, settings] = await Promise.all([getOrders(), getStoreSettings()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Sales
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Orders</h2>
      </div>
      <OrdersManager orders={orders} currency={settings.currency} />
    </div>
  );
}
