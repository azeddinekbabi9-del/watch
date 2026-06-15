import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "form-field focus-ring h-12 w-full rounded-md border border-gold/25 px-3 text-base shadow-sm shadow-black/10 transition-colors duration-300 hover:border-gold/55 md:h-11 md:text-sm",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
