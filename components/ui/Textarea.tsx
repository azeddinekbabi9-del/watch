import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "form-field focus-ring min-h-28 w-full rounded-md border border-gold/25 px-3 py-3 text-base shadow-sm shadow-black/10 transition-colors duration-300 hover:border-gold/55 md:text-sm",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
