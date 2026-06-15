"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
      className="focus-ring fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 bg-[#0b0b0b] text-[#25D366] shadow-[0_18px_50px_rgba(0,0,0,0.42),0_0_24px_rgba(37,211,102,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#25D366]/70 hover:bg-[#25D366] hover:text-white sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      aria-label="Message store on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
    </Link>
  );
}
