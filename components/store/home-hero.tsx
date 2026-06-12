import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

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

export function HomeHero({ hero }: HomeHeroProps) {
  const imageUrl = hero.image || hero.mobileImage || "";

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,162,74,0.18),transparent_32%),radial-gradient(circle_at_20%_70%,rgba(0,107,85,0.22),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:42px_42px] opacity-20" />

      <div className="container-pad relative grid min-h-[720px] items-center gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="animate-fade-in-up max-w-xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#c9a24a]">
            Listings
          </p>

          <h1 className="font-display text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            {hero.title || "The Latest Listings"}
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-white/65 sm:text-lg">
            {hero.subtitle ||
              "Shop premium watches with secure ordering and fast support."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={hero.ctaHref || "/products"}
              className="gold-button-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c9a24a] px-7 py-3 text-sm font-black text-[#050505] shadow-[0_18px_55px_rgba(201,162,74,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e0bd63]"
            >
              {hero.ctaLabel || "Shop Now"}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/track-order"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c9a24a]/35 bg-white/5 px-7 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-[#c9a24a] hover:text-[#c9a24a]"
            >
              Track Order
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Secure", "Direct ordering"],
              ["Fast", "Local support"],
              ["Premium", "Curated watches"]
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-black text-[#c9a24a]">{title}</p>
                <p className="mt-1 text-xs text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px] animate-fade-in-up lg:ml-auto">
          <div className="absolute left-3 top-8 z-20 hidden rounded-2xl border border-white/10 bg-[#111111]/90 p-4 shadow-2xl backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-[#c9a24a]" />
              <div>
                <p className="text-sm font-black">Excellent</p>
                <p className="text-xs text-white/55">Clean finish and detail</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 right-2 z-20 hidden rounded-2xl border border-white/10 bg-[#111111]/90 p-4 shadow-2xl backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#006b55]" />
              <div>
                <p className="text-sm font-black">Luxury Vibes</p>
                <p className="text-xs text-white/55">Premium wrist presence</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#c9a24a]/20 bg-gradient-to-br from-[#181818] via-[#0b0b0b] to-[#005c49]/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,74,0.16),transparent_42%)]" />

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={hero.title || "Luxury watch"}
                className="relative z-10 mx-auto aspect-square max-h-[560px] w-full rounded-[1.5rem] object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.7)] transition duration-700 hover:scale-[1.03]"
              />
            ) : (
              <div className="relative z-10 flex aspect-square items-center justify-center rounded-[1.5rem] border border-white/10 bg-[#050505]">
                <ShieldCheck className="h-24 w-24 text-[#c9a24a]/70" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}