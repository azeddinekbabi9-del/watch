import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

type HomeHeroProps = {
  hero: {
    title: string;
    subtitle: string;
    image?: string | null;
    mobileImage?: string | null;
    ctaLabel?: string;
    ctaHref?: string;
  };
};

const fallbackSubtitle =
  "ساعات أنيقة بتصميم فاخر وجودة عالية — اطلب الآن والدفع عند الاستلام.";

export function HomeHero({ hero }: HomeHeroProps) {
  const imageUrl = hero.image || hero.mobileImage || "";

  return (
    <section className="relative min-h-[calc(100svh-68px)] overflow-hidden bg-[#050505] text-white">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="WQITAK luxury wristwatch"
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.2),transparent_24rem)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/78 to-[#050505]" />

      <div className="container-page relative flex min-h-[calc(100svh-68px)] items-center py-14 sm:py-16 lg:min-h-[760px] lg:py-20">
        <div className="hero-reveal max-w-3xl">
          <div className="mb-7 h-px w-32 bg-gradient-to-r from-gold via-champagne to-transparent" />
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-champagne">
            Luxury wristwatches
          </p>
          <h1 className="gold-text mt-5 text-6xl font-semibold leading-[0.9] tracking-[0.08em] sm:text-7xl md:text-8xl">
            {hero.title || "WQITAK"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-cream/82 md:text-xl">
            {hero.subtitle || fallbackSubtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={hero.ctaHref || "/products"}
              className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}
            >
              {hero.ctaLabel || "Order Now"}
            </Link>
            <Link
              href="/track-order"
              className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto" })}
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
