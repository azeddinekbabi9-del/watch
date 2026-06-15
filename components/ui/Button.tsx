import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export function buttonVariants({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "focus-ring luxury-button-hover inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-[0.01em] disabled:pointer-events-none disabled:opacity-55",
    {
      "gold-shimmer border border-champagne/70 bg-gold-sheen text-ink shadow-[0_16px_40px_rgba(212,175,55,0.24)] hover:border-champagne hover:brightness-110":
        variant === "primary",
      "border border-gold/35 bg-[#090909] text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-champagne hover:bg-[#111111] hover:text-champagne":
        variant === "secondary",
      "border border-gold/35 bg-white/5 text-cream hover:border-champagne hover:bg-gold/10 hover:text-champagne":
        variant === "outline",
      "text-cream/78 hover:bg-gold/10 hover:text-champagne":
        variant === "ghost",
      "bg-coral text-white hover:brightness-95": variant === "danger",
      "h-10 px-3 text-sm": size === "sm",
      "h-12 px-4 text-base md:h-11 md:text-sm": size === "md",
      "min-h-12 px-5 text-base": size === "lg",
      "h-11 w-11 p-0 md:h-10 md:w-10": size === "icon"
    },
    className
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
);

Button.displayName = "Button";
