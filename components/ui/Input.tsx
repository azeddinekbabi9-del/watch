import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "focus-ring h-12 w-full rounded-md border border-gold/25 bg-white/90 px-3 text-base text-ink shadow-sm transition-colors duration-300 placeholder:text-ink/35 hover:border-gold/45 md:h-11 md:text-sm",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
