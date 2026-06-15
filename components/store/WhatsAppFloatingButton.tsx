"use client";

import Link from "next/link";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloatingButton({ phone }: { phone: string }) {
  if (!phone) {
    return null;
  }

  return (
    <Link
      href={createWhatsAppUrl(phone, "Hello, I want to ask about your products.")}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float focus-ring fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.28),0_0_24px_rgba(37,211,102,0.24)] transition-all duration-300 hover:-translate-y-1 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      aria-label="Message store on WhatsApp"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/4494/4494494.png"
        alt=""
        className="h-full w-full object-contain"
      />
    </Link>
  );
}
