"use client";

import * as React from "react";
import { ProductImageFrame } from "@/components/store/ProductImageFrame";
import { productImageFallback } from "@/lib/utils";

export function ProductGallery({
  productName,
  image,
  gallery
}: {
  productName: string;
  image: string | null;
  gallery: string[] | null;
}) {
  const images = [image, ...(gallery ?? [])].filter(Boolean) as string[];
  const [active, setActive] = React.useState(images[0] || productImageFallback);

  return (
    <div className="luxury-reveal space-y-3">
      <ProductImageFrame
        src={active}
        alt={productName}
        className="mx-auto rounded-md border border-gold/25 p-2 shadow-luxury"
        imageClassName="rounded-[0.35rem]"
      />
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActive(item)}
              className="focus-ring aspect-square overflow-hidden rounded-md border border-gold/25 bg-[#050505] p-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne hover:shadow-soft"
              aria-label={`Show ${productName} image`}
            >
              <ProductImageFrame
                src={item}
                alt=""
                className="h-full w-full rounded-[0.25rem]"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
