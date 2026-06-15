import type { Metadata } from "next";
import "@/app/globals.css";
import { CustomerChrome } from "@/components/store/CustomerChrome";
import { getProducts, getStoreSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "WQITAK",
  description:
    "Luxury wristwatches with direct ordering, WhatsApp confirmation, and cash on delivery."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [settings, searchProducts] = await Promise.all([
    getStoreSettings(),
    getProducts()
  ]);

  return (
    <html lang="ar">
      <body>
        <CustomerChrome settings={settings} searchProducts={searchProducts}>
          {children}
        </CustomerChrome>
      </body>
    </html>
  );
}
