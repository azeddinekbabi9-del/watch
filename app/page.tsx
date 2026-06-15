import Link from "next/link";
import { BadgeCheck, Clock, MessageCircle, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { ProductCard } from "@/components/store/ProductCard";
import { getCategories, getProducts, getStoreSettings } from "@/lib/data";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const heroSubtitle =
  "ساعات أنيقة بتصميم فاخر وجودة عالية — اطلب الآن والدفع عند الاستلام.";

export default async function HomePage() {
  const [settings, featuredProducts, categories] = await Promise.all([
    getStoreSettings(),
    getProducts({ featuredOnly: true }),
    getCategories(true)
  ]);

  const heroImage =
    settings.hero_image_url ||
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1800&q=85";

  return (
    <div className="luxury-page page-transition">
      <section className="relative min-h-[calc(100svh-68px)] overflow-hidden text-white lg:min-h-[780px]">
        <img
          src={heroImage}
          alt="WQITAK luxury wristwatch"
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.2),transparent_24rem)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/78 to-[#050505]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="container-page relative flex min-h-[calc(100svh-68px)] items-center py-14 sm:py-16 lg:min-h-[780px] lg:py-20">
          <div className="hero-reveal max-w-3xl">
            <div className="mb-7 h-px w-32 bg-gradient-to-r from-gold via-champagne to-transparent" />
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-champagne">
              Luxury wristwatches
            </p>
            <h1 className="gold-text mt-5 text-6xl font-semibold leading-[0.9] tracking-[0.08em] sm:text-7xl md:text-8xl">
              WQITAK
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-cream/82 md:text-xl">
              {heroSubtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "w-full sm:w-auto"
                })}
              >
                Order Now
              </Link>
              {settings.admin_whatsapp_phone ? (
                <Link
                  href={createWhatsAppUrl(
                    settings.admin_whatsapp_phone,
                    "Hello, I want to order a WQITAK watch."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full sm:w-auto"
                  })}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </Link>
              ) : null}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["COD", "الدفع عند الاستلام"],
                ["Premium", "اختيارات فاخرة"],
                ["Fast", "تأكيد مباشر"]
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-md border border-gold/20 bg-white/[0.055] p-4 backdrop-blur"
                >
                  <p className="text-sm font-bold text-champagne">{title}</p>
                  <p className="mt-1 text-xs text-cream/60">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {settings.show_featured_products ? (
        <section className="relative container-page luxury-reveal py-12 sm:py-14 lg:py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                WQITAK Selection
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-cream md:text-4xl">
                ساعات مختارة لطلّة فاخرة
              </h2>
            </div>
            <Link href="/products" className="font-semibold text-champagne transition-colors duration-300 hover:text-white">
              كل الساعات
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={settings.currency}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="luxury-panel rounded-md p-8 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-gold" aria-hidden />
              <h3 className="mt-3 text-lg font-semibold text-cream">
                سيتم عرض ساعات WQITAK المختارة قريبا
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cream/62">
                أضف منتجات مميزة من لوحة الإدارة لتظهر هنا بتصميم فاخر.
              </p>
            </div>
          )}
        </section>
      ) : null}

      {settings.show_categories && categories.length > 0 ? (
        <section id="categories" className="relative border-y border-gold/15 bg-[#090909] py-12 text-cream sm:py-14 lg:py-16">
          <div className="container-page">
            <div className="luxury-reveal mx-auto mb-8 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                Collections
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-cream md:text-4xl">
                تصنيفات WQITAK
              </h2>
              <div className="gold-divider mx-auto mt-5 w-32" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="luxury-card-hover animate-slide-up group overflow-hidden rounded-md border border-gold/20 bg-white/[0.045] shadow-soft"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#050505]">
                    <img
                      src={
                        category.image_url ||
                        "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={category.name}
                      className="h-full w-full object-cover opacity-84 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-cream">{category.name}</h3>
                    {category.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-cream/62">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {settings.show_benefits ? (
        <section className="relative container-page luxury-reveal py-12 sm:py-14 lg:py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "جودة مختارة",
                text: "كل ساعة كتقدم حضور فاخر وتفاصيل مصقولة بعناية."
              },
              {
                icon: Clock,
                title: "طلب مباشر",
                text: "اختار الساعة، عمر معلوماتك، وفريق WQITAK يتواصل معك للتأكيد."
              },
              {
                icon: Truck,
                title: "الدفع عند الاستلام",
                text: settings.delivery_text || "توصيل مع تأكيد عبر الهاتف أو واتساب."
              }
            ].map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="luxury-card-hover rounded-md border border-gold/20 bg-white/[0.045] p-6 shadow-soft"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-gold/10">
                    <Icon className="h-6 w-6 text-champagne" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-cream">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-cream/62">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-gold/80">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            WQITAK luxury direct ordering
          </div>
        </section>
      ) : null}
    </div>
  );
}
