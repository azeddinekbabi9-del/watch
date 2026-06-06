import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/store/ProductCard";
import { getCategories, getProducts, getStoreSettings } from "@/lib/data";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featuredProducts, categories] = await Promise.all([
    getStoreSettings(),
    getProducts({ featuredOnly: true }),
    getCategories(true)
  ]);

  return (
    <div className="page-transition">
      <section className="luxury-dark-surface relative min-h-[calc(100svh-68px)] overflow-hidden text-white lg:min-h-[760px]">
        <img
          src={
            settings.hero_image_url ||
            "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80"
          }
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-48"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,154,74,0.18),transparent_22rem)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/78 via-ink/72 to-ink" />
        <div className="absolute left-1/2 top-24 hidden h-48 w-48 -translate-x-1/2 rounded-full border border-gold/20 md:block" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cloud to-transparent" />
        <div className="container-page relative flex min-h-[calc(100svh-68px)] items-center justify-center py-14 sm:py-16 lg:min-h-[760px] lg:py-20">
          <div className="hero-reveal mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
              {settings.store_name}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl md:text-7xl">
              {settings.hero_title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/76 md:text-lg">
              {settings.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "w-full sm:w-auto"
                })}
              >
                Shop products
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {settings.admin_whatsapp_phone ? (
                <Link
                  href={createWhatsAppUrl(
                    settings.admin_whatsapp_phone,
                    "Hello, I want to ask about your products."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full border-gold/45 bg-white/8 text-white hover:border-gold hover:bg-gold/15 sm:w-auto"
                  })}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {settings.show_featured_products ? (
        <section className="container-page luxury-reveal py-10 sm:py-12 lg:py-14">
          <div className="mb-8 flex flex-col justify-between gap-3 text-center sm:flex-row sm:items-end sm:text-left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink md:text-4xl">
                Signature watches
              </h2>
            </div>
            <Link href="/products" className="font-semibold text-gold transition-colors duration-300 hover:text-ink">
              View all products
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
            <EmptyState
              title="No featured products"
              description="Mark products as featured in admin to show them here."
            />
          )}
        </section>
      ) : null}

      {settings.show_categories ? (
        <section id="categories" className="luxury-dark-surface py-10 text-cream sm:py-12 lg:py-14">
          <div className="container-page">
            <div className="luxury-reveal mx-auto mb-8 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                Categories
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-cream md:text-4xl">
                Curated collections
              </h2>
              <div className="gold-divider mx-auto mt-5 w-32" />
            </div>
            {categories.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className="luxury-card-hover animate-slide-up group overflow-hidden rounded-md border border-gold/20 bg-cream/6 shadow-soft"
                  >
                    <div className="relative aspect-[5/3] overflow-hidden bg-ink">
                      <img
                        src={
                          category.image_url ||
                          "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80"
                        }
                        alt={category.name}
                        className="h-full w-full object-cover opacity-84 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/82 via-ink/15 to-transparent" />
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
            ) : (
              <EmptyState
                title="No categories"
                description="Create visible categories in admin to show them here."
              />
            )}
          </div>
        </section>
      ) : null}

      {settings.show_benefits ? (
        <section className="container-page luxury-reveal py-10 sm:py-12 lg:py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Private confirmation",
                text: "Orders are prepared with complete details and confirmed through WhatsApp."
              },
              {
                icon: ShieldCheck,
                title: "Curated catalog",
                text: "Collections, product details, and homepage content stay refined from admin."
              },
              {
                icon: BadgeCheck,
                title: "Clear availability",
                text: "Every timepiece shows availability before customers submit a direct order."
              }
            ].map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="luxury-card-hover rounded-md border border-gold/20 bg-white/88 p-6 shadow-soft"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                    <Icon className="h-6 w-6 text-gold" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
