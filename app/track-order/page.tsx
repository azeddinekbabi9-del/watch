import { TrackOrderClient } from "@/components/store/TrackOrderClient";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({
  searchParams
}: {
  searchParams?: { orderId?: string };
}) {
  const settings = await getStoreSettings();

  return (
    <TrackOrderClient
      initialOrderId={searchParams?.orderId}
      currency={settings.currency}
      adminWhatsappPhone={settings.admin_whatsapp_phone}
    />
  );
}
