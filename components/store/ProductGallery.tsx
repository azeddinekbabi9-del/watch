"use client";

import * as React from "react";
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
      <div className="group aspect-[4/3] overflow-hidden rounded-md bg-mint shadow-soft">
        <img
          src={active}
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActive(item)}
              className="focus-ring aspect-square overflow-hidden rounded-md border border-gold/15 bg-white transition-all duration-300 hover:border-gold"
              aria-label={`Show ${productName} image`}
            >
              <img
                src={item}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
