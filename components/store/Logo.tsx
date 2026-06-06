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
    size === "lg"
      ? "h-16 w-16 sm:h-20 sm:w-20"
      : size === "sm"
        ? "h-11 w-11 sm:h-12 sm:w-12"
        : "h-12 w-12 sm:h-14 sm:w-14";
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
        <span className={`max-w-[8.5rem] truncate font-semibold tracking-[0.12em] sm:max-w-[14rem] ${nameSize} ${textClassName}`}>
          {storeName}
        </span>
      ) : null}
    </span>
  );
}
