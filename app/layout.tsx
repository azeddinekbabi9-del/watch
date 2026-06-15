import type { Metadata } from "next";
import "@/app/globals.css";
import { CustomerChrome } from "@/components/store/CustomerChrome";
import { getProducts, getStoreSettings, getStoreTexts } from "@/lib/data";
import { getServerLanguage, getServerTheme, getTextDirection } from "@/lib/preferences";

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
  const language = getServerLanguage();
  const theme = getServerTheme();
  const [settings, searchProducts, texts] = await Promise.all([
    getStoreSettings(),
    getProducts(),
    getStoreTexts()
  ]);

  return (
    <html lang={language} dir={getTextDirection(language)} data-theme={theme}>
      <body>
        <CustomerChrome
          settings={settings}
          searchProducts={searchProducts}
          language={language}
          theme={theme}
          texts={texts}
        >
          {children}
        </CustomerChrome>
      </body>
    </html>
  );
}
