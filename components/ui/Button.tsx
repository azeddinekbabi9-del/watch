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
      "gold-shimmer border border-gold/45 bg-gold-sheen text-ink shadow-[0_14px_32px_rgba(201,154,74,0.24)] hover:border-champagne hover:brightness-105":
        variant === "primary",
      "border border-gold/35 bg-ink text-cream hover:border-gold hover:bg-charcoal":
        variant === "secondary",
      "border border-gold/35 bg-cream/80 text-ink hover:border-gold hover:bg-gold/10":
        variant === "outline",
      "text-ink hover:bg-gold/10 hover:text-ink":
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
