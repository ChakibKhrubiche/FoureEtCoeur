import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Check } from "lucide-react";
import { productRepository } from "@/repositories/product.repository";
import { favoriteRepository } from "@/repositories/favorite.repository";
import { getCurrentUser } from "@/lib/session";
import { formatPrice, formatDate } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { BADGE_LABELS } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/products/product-gallery";
import { AddToCart } from "@/components/products/add-to-cart";
import { FavoriteButton } from "@/components/products/favorite-button";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/animations/reveal";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);
  if (!product) return { title: "Produit introuvable" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);
  if (!product) notFound();

  const user = await getCurrentUser();
  const [related, favoriteIds] = await Promise.all([
    productRepository.findRelated(product.id, product.categoryId, 4),
    user ? favoriteRepository.getProductIds(user.id) : Promise.resolve(new Set<string>()),
  ]);

  const inStock = product.stock > 0;

  // JSON-LD pour le SEO (Schema.org Product)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.currency,
      price: (product.price / 100).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.ratingCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.ratingAvg.toFixed(1),
        reviewCount: product.ratingCount,
      },
    }),
  };

  return (
    <div className="bg-ivory pb-24 pt-28 md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-px mx-auto max-w-[100rem]">
        {/* Fil d'Ariane */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-chocolate">
            Accueil
          </Link>
          <span>/</span>
          <Link
            href={`/catalogue?categorie=${product.category.slug}`}
            className="hover:text-chocolate"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-chocolate">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Galerie */}
          <ProductGallery images={product.images} alt={product.name} />

          {/* Informations */}
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-widest text-caramel">
              {product.category.name}
            </p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <h1 className="font-heading text-4xl font-light text-chocolate sm:text-5xl">
                {product.name}
              </h1>
              {product.badge && (
                <Badge className="mt-2 shrink-0 rounded-full">
                  {BADGE_LABELS[product.badge]}
                </Badge>
              )}
            </div>

            {product.ratingCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(product.ratingAvg)
                          ? "size-4 fill-gold"
                          : "size-4 text-border"
                      }
                    />
                  ))}
                </span>
                <span className="text-muted-foreground">
                  {product.ratingAvg.toFixed(1)} · {product.ratingCount} avis
                </span>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-heading text-3xl text-chocolate">
                {formatPrice(product.price / 100)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice / 100)}
                </span>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Disponibilité */}
            <p className="mt-6 flex items-center gap-2 text-sm">
              {inStock ? (
                <>
                  <Check className="size-4 text-green-600" />
                  <span className="text-chocolate">
                    En stock · prêt à être préparé
                  </span>
                </>
              ) : (
                <span className="text-destructive">Momentanément épuisé</span>
              )}
            </p>

            {/* Ajout panier */}
            <div className="mt-8 flex items-center gap-3">
              <AddToCart
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.images[0] ?? "",
                  stock: product.stock,
                }}
                className="flex-1"
              />
              <FavoriteButton
                productId={product.id}
                initialActive={favoriteIds.has(product.id)}
                className="size-12 border border-border"
              />
            </div>

            <Separator className="my-8" />

            {/* Détails */}
            <dl className="space-y-4 text-sm">
              {product.weightGrams && (
                <div className="flex gap-4">
                  <dt className="w-32 shrink-0 text-muted-foreground">Poids</dt>
                  <dd className="text-chocolate">{product.weightGrams} g</dd>
                </div>
              )}
              {product.ingredients.length > 0 && (
                <div className="flex gap-4">
                  <dt className="w-32 shrink-0 text-muted-foreground">
                    Ingrédients
                  </dt>
                  <dd className="text-chocolate">
                    {product.ingredients.join(", ")}
                  </dd>
                </div>
              )}
              {product.allergens.length > 0 && (
                <div className="flex gap-4">
                  <dt className="w-32 shrink-0 text-muted-foreground">
                    Allergènes
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {product.allergens.map((a) => (
                      <Badge key={a} variant="outline" className="rounded-full">
                        {a}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Avis */}
        {product.reviews.length > 0 && (
          <section className="mt-24">
            <h2 className="font-heading text-3xl font-light text-chocolate">
              Avis clients
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {product.reviews.map((review) => (
                <figure
                  key={review.id}
                  className="rounded-2xl border border-border bg-warm-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.rating
                              ? "size-4 fill-gold"
                              : "size-4 text-border"
                          }
                        />
                      ))}
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </time>
                  </div>
                  {review.title && (
                    <figcaption className="mt-3 font-medium text-chocolate">
                      {review.title}
                    </figcaption>
                  )}
                  {review.comment && (
                    <blockquote className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </blockquote>
                  )}
                  <p className="mt-4 text-sm text-chocolate">
                    {review.user.name ?? "Client vérifié"}
                  </p>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Produits similaires */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-heading text-3xl font-light text-chocolate">
              Vous aimerez aussi
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {related.map((p) => (
                <Reveal key={p.id}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
