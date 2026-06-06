import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Package, ShoppingCart, Users, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getDashboardStats, getStoreSettings } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

export const dynamic = "force-dynamic";

function statusTone(status: OrderStatus) {
  if (status === "delivered") {
    return "success" as const;
  }
  if (status === "cancelled") {
    return "danger" as const;
  }
  if (status === "pending") {
    return "warning" as const;
  }
  return "info" as const;
}

export default async function AdminDashboardPage() {
  const [stats, settings] = await Promise.all([
    getDashboardStats(),
    getStoreSettings()
  ]);

  const cards = [
    {
      label: "Total orders",
      value: stats.totalOrders,
      icon: ShoppingCart
    },
    {
      label: "Pending orders",
      value: stats.pendingOrders,
      icon: Clock
    },
    {
      label: "Delivered orders",
      value: stats.completedOrders,
      icon: CheckCircle2
    },
    {
      label: "Total products",
      value: stats.totalProducts,
      icon: Package
    },
    {
      label: "Total customers",
      value: stats.totalCustomers,
      icon: Users
    },
    {
      label: "Estimated revenue",
      value: formatPrice(stats.estimatedRevenue, settings.currency),
      icon: Wallet
    }
  ];

  return (
    <div className="page-transition space-y-8">
      <div className="hero-reveal">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          Overview
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Dashboard</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="luxury-card-hover animate-slide-up rounded-md border border-gold/20 bg-white/92 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink/55">{card.label}</p>
                <Icon className="h-5 w-5 text-gold" aria-hidden />
              </div>
              <p className="mt-4 text-3xl font-bold text-ink">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4">
        <div className="luxury-card-hover rounded-md border border-gold/20 bg-white/92 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-ink">Recent orders</h3>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors duration-300 hover:text-ink"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 rounded-md border border-ink/10 p-3 transition-all duration-300 hover:border-gold/40 hover:bg-cloud"
                >
                  <div>
                    <p className="font-semibold text-ink">{order.customer_name}</p>
                    <p className="text-sm text-ink/55">{order.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      {formatPrice(Number(order.total_amount), settings.currency)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-md border border-dashed border-ink/15 p-5 text-center text-sm text-ink/55">
                No orders yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
