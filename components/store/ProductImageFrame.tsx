import { ResponsiveStoreImage } from "@/components/store/ResponsiveStoreImage";
import { cn } from "@/lib/utils";

export function ProductImageFrame({
  src,
  alt,
  className,
  imageClassName
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("product-image-frame", className)}>
      <ResponsiveStoreImage
        src={src}
        alt={alt}
        variant="product"
        className={cn("product-image", imageClassName)}
      />
    </div>
  );
}
