import type { Metadata } from "next";
import "@/app/globals.css";
import { CustomerChrome } from "@/components/store/CustomerChrome";
import { getProducts, getStoreSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "VQ Watches",
  description: "A premium watch store powered by Supabase and WhatsApp ordering."
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
    <html lang="en">
      <body>
        <CustomerChrome settings={settings} searchProducts={searchProducts}>
          {children}
        </CustomerChrome>
      </body>
    </html>
  );
}
