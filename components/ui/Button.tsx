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
    "focus-ring luxury-button-hover inline-flex items-center justify-center gap-2 rounded-md font-semibold disabled:pointer-events-none disabled:opacity-55",
    {
      "bg-[var(--store-main)] text-cream shadow-sm hover:brightness-110":
        variant === "primary",
      "bg-champagne text-ink hover:bg-gold hover:text-cream": variant === "secondary",
      "border border-ink/15 bg-cream text-ink hover:border-gold/60 hover:bg-white":
        variant === "outline",
      "text-ink hover:bg-gold/10 hover:text-ink": variant === "ghost",
      "bg-coral text-white hover:brightness-95": variant === "danger",
      "h-9 px-3 text-sm": size === "sm",
      "h-11 px-4 text-sm": size === "md",
      "h-12 px-5 text-base": size === "lg",
      "h-10 w-10 p-0": size === "icon"
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
