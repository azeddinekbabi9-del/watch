import { getImageSizeConfig, getSizedImageUrl, type StoreImageVariant } from "@/lib/images";

export function ResponsiveStoreImage({
  src,
  alt,
  variant,
  className
}: {
  src: string;
  alt: string;
  variant: StoreImageVariant;
  className?: string;
}) {
  const config = getImageSizeConfig(variant);
  const desktopSrc = getSizedImageUrl(
    src,
    config.desktop.width,
    config.desktop.height
  );
  const mobileSrc = getSizedImageUrl(
    src,
    config.mobile.width,
    config.mobile.height
  );

  return (
    <picture className="block h-full w-full">
      <source media="(max-width: 640px)" srcSet={mobileSrc} />
      <img
        src={desktopSrc}
        alt={alt}
        width={config.desktop.width}
        height={config.desktop.height}
        sizes={config.sizes}
        className={className}
        loading={variant === "hero" ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
