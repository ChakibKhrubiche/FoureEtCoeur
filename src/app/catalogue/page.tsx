import type { Metadata } from "next";
import { Suspense } from "react";
import { categoryRepository } from "@/repositories/category.repository";
import { productRepository } from "@/repositories/product.repository";
import { favoriteRepository } from "@/repositories/favorite.repository";
import { getCurrentUser } from "@/lib/session";
import { parseCatalogueParams, type RawSearchParams } from "@/lib/catalogue";
import { ProductCard } from "@/components/products/product-card";
import { Reveal, StaggerContainer } from "@/components/animations/reveal";
import { FiltersPanel } from "@/components/catalogue/filters-panel";
import { MobileFilters } from "@/components/catalogue/mobile-filters";
import { CatalogueSearch } from "@/components/catalogue/catalogue-search";
import { CatalogueSort } from "@/components/catalogue/catalogue-sort";
import { CataloguePagination } from "@/components/catalogue/catalogue-pagination";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Découvrez toutes les créations Four & Cœur : cookies, brownies, gâteaux, viennoiseries, box gourmandes et plateaux, faits main.",
};

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseCatalogueParams(sp);

  const user = await getCurrentUser();
  const [categoriesRaw, result, favoriteIds] = await Promise.all([
    categoryRepository.findAllWithCount(),
    productRepository.search(filters),
    user ? favoriteRepository.getProductIds(user.id) : Promise.resolve(new Set<string>()),
  ]);

  const categories = categoriesRaw.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: c._count.products,
  }));

  const { items, total, page, totalPages } = result;

  return (
    <div className="bg-ivory pb-24 pt-28 md:pt-32">
      <div className="container-px mx-auto max-w-[100rem]">
        {/* En-tête */}
        <header className="border-b border-border pb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-caramel">
            Nos créations
          </p>
          <h1 className="font-heading text-4xl font-light text-chocolate sm:text-5xl">
            Le catalogue
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Chaque pièce est façonnée à la main, le jour même. Trouvez la
            création qui fera de votre moment un instant d&apos;exception.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Filtres (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Suspense>
                <FiltersPanel categories={categories} />
              </Suspense>
            </div>
          </aside>

          {/* Contenu */}
          <div>
            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Suspense>
                  <MobileFilters categories={categories} />
                </Suspense>
                <p className="text-sm text-muted-foreground">
                  {total} création{total > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Suspense>
                  <CatalogueSearch />
                </Suspense>
                <Suspense>
                  <CatalogueSort />
                </Suspense>
              </div>
            </div>

            {/* Grille */}
            {items.length > 0 ? (
              <StaggerContainer
                className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3"
                stagger={0.06}
              >
                {items.map((product) => (
                  <Reveal key={product.id}>
                    <ProductCard
                      product={product}
                      isFavorite={favoriteIds.has(product.id)}
                    />
                  </Reveal>
                ))}
              </StaggerContainer>
            ) : (
              <div className="mt-20 text-center">
                <p className="font-heading text-2xl text-chocolate">
                  Aucune création ne correspond
                </p>
                <p className="mt-3 text-muted-foreground">
                  Essayez d&apos;ajuster vos filtres ou votre recherche.
                </p>
              </div>
            )}

            <Suspense>
              <CataloguePagination page={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
