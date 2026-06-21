export type StoreImageVariant = "hero" | "product";

const imageSizes = {
  hero: {
    desktop: { width: 1600, height: 500 },
    mobile: { width: 500, height: 250 },
    sizes: "(max-width: 640px) 500px, 1600px"
  },
  product: {
    desktop: { width: 500, height: 500 },
    mobile: { width: 500, height: 500 },
    sizes: "(max-width: 500px) 100vw, 500px"
  }
} as const;

export function getImageSizeConfig(variant: StoreImageVariant) {
  return imageSizes[variant];
}

export function getSizedImageUrl(url: string, width: number, height: number) {
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("images.unsplash.com")) {
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", width === height ? "max" : "crop");
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("h", String(height));
      parsed.searchParams.set("q", "85");
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}
