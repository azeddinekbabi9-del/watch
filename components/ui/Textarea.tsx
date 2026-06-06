import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "focus-ring min-h-28 w-full rounded-md border border-gold/25 bg-white/90 px-3 py-3 text-base text-ink shadow-sm transition-colors duration-300 placeholder:text-ink/35 hover:border-gold/45 md:text-sm",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
