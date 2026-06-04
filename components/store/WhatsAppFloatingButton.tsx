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
      className="focus-ring fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury"
      aria-label="Message store on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </Link>
  );
}
