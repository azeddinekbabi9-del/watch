import type { StoreSettings } from "@/types/database";

export function Logo({
  settings,
  size = "md",
  showName = true,
  textClassName = "text-ink"
}: {
  settings?: Pick<StoreSettings, "logo_url" | "store_name">;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  textClassName?: string;
}) {
  const imageSize =
    size === "lg" ? "h-16 w-16" : size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const nameSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const logoUrl = settings?.logo_url || "/watch-logo.png";
  const storeName = settings?.store_name || "VQ Watches";

  return (
    <span className="flex min-w-0 items-center gap-3">
      <img
        src={logoUrl}
        alt={storeName}
        className={`logo-static ${imageSize} shrink-0 object-contain`}
      />
      {showName ? (
        <span className={`truncate font-semibold tracking-[0.12em] ${nameSize} ${textClassName}`}>
          {storeName}
        </span>
      ) : null}
    </span>
  );
}
