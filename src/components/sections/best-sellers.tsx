import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProductCard } from "@/components/products/product-card";
import { Reveal, StaggerContainer } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory } from "@/types/product";

export function BestSellers({
  products,
}: {
  products: ProductWithCategory[];
}) {
  return (
    <section className="bg-ivory section-py">
      <div className="container-px mx-auto max-w-[100rem]">
        <SectionHeading
          eyebrow="Les préférés de nos clients"
          title="Best-sellers"
          description="Les créations que l'on s'arrache. Impossible de repartir sans."
        />

        <StaggerContainer className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Reveal key={product.id}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </StaggerContainer>

        <div className="mt-14 flex justify-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/catalogue">
              Voir toutes nos créations
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
