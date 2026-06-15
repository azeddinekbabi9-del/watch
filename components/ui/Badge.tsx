import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border border-gold/25 bg-gold/10 text-champagne",
  success: "border border-gold/30 bg-gold/10 text-champagne",
  warning: "border border-gold/35 bg-saffron/20 text-champagne",
  danger: "bg-coral/15 text-coral",
  info: "border border-gold/25 bg-ink text-cream"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
