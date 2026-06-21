"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const phoneNumber = "212779012599";
const whatsappIconUrl = "https://cdn-icons-png.flaticon.com/512/4494/4494494.png";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();

  const handleClick = React.useCallback(() => {
    const path =
      typeof window !== "undefined" ? window.location.pathname : pathname || "";
    const parts = path.split("/").filter(Boolean);
    const productName = decodeURIComponent(parts[parts.length - 1] || "");
    const message = `أودّ التواصل معكم بخصوص هذا المنتج: ${productName}`;
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

    if (openedWindow) {
      openedWindow.opener = null;
    }
  }, [pathname]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="whatsapp-float group focus-ring fixed bottom-[18px] right-[18px] z-[9999] flex h-[62px] w-[62px] items-center justify-center rounded-full bg-transparent p-0"
      aria-label="Message store on WhatsApp"
    >
      <span className="pointer-events-none absolute right-[74px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#25d366] px-3 py-2 text-sm font-bold text-white opacity-0 shadow-[0_0_18px_rgba(37,211,102,0.75)] transition-all duration-200 after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-y-[6px] after:border-l-[8px] after:border-y-transparent after:border-l-[#25d366] group-hover:opacity-100 group-hover:-translate-x-1 group-focus-visible:opacity-100 group-focus-visible:-translate-x-1">
        تواصل معنا
      </span>
      <img
        src={whatsappIconUrl}
        alt=""
        className="h-[62px] w-[62px] object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]"
      />
    </button>
  );
}
