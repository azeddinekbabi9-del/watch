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
      <section className="relative min-h-[68vh] overflow-hidden bg-ink text-white">
        <img
          src={
            settings.hero_image_url ||
            "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80"
          }
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cloud to-transparent" />
        <div className="container-page relative flex min-h-[68vh] items-center py-16">
          <div className="hero-reveal max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              {settings.store_name}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
              {settings.hero_title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              {settings.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "bg-gold text-ink hover:bg-champagne"
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
                    className: "border-white/35 bg-white/10 text-white hover:border-gold hover:bg-gold/20"
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
        <section className="container-page luxury-reveal py-12">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Signature watches</h2>
            </div>
            <Link href="/products" className="font-semibold text-gold transition-colors duration-300 hover:text-ink">
              View all products
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <section id="categories" className="bg-cream py-12">
          <div className="container-page">
            <div className="luxury-reveal mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
                Categories
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Curated collections</h2>
            </div>
            {categories.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className="luxury-card-hover animate-slide-up group overflow-hidden rounded-md border border-gold/15 bg-cloud"
                  >
                    <div className="aspect-[5/3] overflow-hidden bg-mint">
                      <img
                        src={
                          category.image_url ||
                          "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80"
                        }
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-ink">{category.name}</h3>
                      {category.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
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
        <section className="container-page luxury-reveal py-12">
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
                  className="luxury-card-hover rounded-md border border-gold/15 bg-cream p-5"
                >
                  <Icon className="h-8 w-8 text-gold" aria-hidden />
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
