import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryRepository } from "@/repositories/category.repository";
import { productRepository } from "@/repositories/product.repository";
import { BrandImage } from "@/components/ui/brand-image";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

export const metadata: Metadata = {
  title: "Nos créations",
  description:
    "L'univers Four & Cœur, catégorie par catégorie : cookies, brownies, gâteaux, viennoiseries, box gourmandes et plateaux.",
};

export default async function NosCreationsPage() {
  const [categories, all] = await Promise.all([
    categoryRepository.findAll(),
    productRepository.search({ pageSize: 100, sort: "best-sellers" }),
  ]);

  return (
    <div className="bg-ivory pb-24 pt-28 md:pt-32">
      <div className="container-px mx-auto max-w-[100rem]">
        <SectionHeading
          eyebrow="L'univers Four & Cœur"
          title="Nos créations"
          description="Six familles de gourmandises, une seule exigence : l'excellence du fait main."
        />

        <div className="mt-20 space-y-28">
          {categories.map((category, index) => {
            const products = all.items
              .filter((p) => p.categoryId === category.id)
              .slice(0, 4);
            if (products.length === 0) return null;

            return (
              <section key={category.id}>
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
                  {/* Visuel catégorie */}
                  <Reveal
                    direction={index % 2 === 0 ? "right" : "left"}
                    className={index % 2 === 0 ? "" : "lg:order-2"}
                  >
                    <Link
                      href={`/catalogue?categorie=${category.slug}`}
                      className="group relative block aspect-[4/3] overflow-hidden rounded-3xl"
                    >
                      <BrandImage
                        src={category.image ?? ""}
                        alt={category.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="h-full w-full"
                        imageClassName="transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-chocolate-dark/60 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-8">
                        <h2 className="font-heading text-3xl font-light text-ivory">
                          {category.name}
                        </h2>
                        <span className="mt-2 inline-flex items-center gap-2 text-sm text-ivory/90">
                          Explorer la catégorie
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>

                  {/* Aperçu produits */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    {products.map((product) => (
                      <Reveal key={product.id}>
                        <ProductCard product={product} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
