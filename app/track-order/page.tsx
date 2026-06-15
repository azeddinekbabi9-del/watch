import { TrackOrderClient } from "@/components/store/TrackOrderClient";
import { getStoreSettings, getStoreTexts } from "@/lib/data";
import { getServerLanguage } from "@/lib/preferences";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({
  searchParams
}: {
  searchParams?: { orderId?: string };
}) {
  const language = getServerLanguage();
  const [settings, texts] = await Promise.all([getStoreSettings(), getStoreTexts()]);

  return (
    <TrackOrderClient
      initialOrderId={searchParams?.orderId}
      currency={settings.currency}
      adminWhatsappPhone={settings.admin_whatsapp_phone}
      language={language}
      texts={texts}
    />
  );
}
