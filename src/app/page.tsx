import { productRepository } from "@/repositories/product.repository";
import { Hero } from "@/components/sections/hero";
import { SignatureCreations } from "@/components/sections/signature-creations";
import { ArtOfHomemade } from "@/components/sections/art-of-homemade";
import { BestSellers } from "@/components/sections/best-sellers";
import { Testimonials } from "@/components/sections/testimonials";
import { Ingredients } from "@/components/sections/ingredients";
import { CallToOrder } from "@/components/sections/call-to-order";

export default async function HomePage() {
  const featured = await productRepository.findBestSellers(8);
  const signature = featured.slice(0, 5);
  const bestSellers = featured.slice(0, 8);

  return (
    <>
      {/* 1. Hero Experience */}
      <Hero />
      {/* 2. Signature Creations — scroll horizontal */}
      <SignatureCreations products={signature} />
      {/* 3. The Art of Homemade — sticky storytelling */}
      <ArtOfHomemade />
      {/* 4. Best Sellers */}
      <BestSellers products={bestSellers} />
      {/* 5. Testimonials */}
      <Testimonials />
      {/* 6. Our Ingredients — layer reveal */}
      <Ingredients />
      {/* 7. Call to Order */}
      <CallToOrder />
      {/* 8. Premium Footer — global (layout) */}
    </>
  );
}
