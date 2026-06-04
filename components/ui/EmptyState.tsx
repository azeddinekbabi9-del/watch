import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-60 flex-col items-center justify-center rounded-md border border-dashed border-ink/15 bg-white p-8 text-center",
        className
      )}
    >
      <PackageOpen className="mb-3 h-10 w-10 text-ink/35" aria-hidden />
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">{description}</p>
    </div>
  );
}
