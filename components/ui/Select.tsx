import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "focus-ring h-12 w-full rounded-md border border-gold/25 bg-[#0d0d0d] px-3 text-base text-cream shadow-sm shadow-black/20 transition-colors duration-300 hover:border-gold/55 md:h-11 md:text-sm",
      className
    )}
    {...props}
  />
));

Select.displayName = "Select";
