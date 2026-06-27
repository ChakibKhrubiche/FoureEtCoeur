"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/ui/brand-image";
import { formatPrice } from "@/lib/format";
import type { ProductWithCategory } from "@/types/product";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll horizontal épinglé : la section reste fixe pendant que les cartes
 * défilent latéralement. Désactivé en deçà de lg et si reduced-motion.
 */
export function SignatureCreations({
  products,
}: {
  products: ProductWithCategory[];
}) {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (reduce || !isDesktop || !track.current) return;

      const distance = track.current.scrollWidth - window.innerWidth;
      if (distance <= 0) return;

      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative overflow-hidden bg-ivory lg:h-screen"
    >
      <div
        ref={track}
        className="flex flex-col gap-10 px-6 py-20 sm:px-8 lg:h-screen lg:flex-row lg:items-center lg:gap-12 lg:py-0 lg:pl-[8vw] lg:pr-[12vw]"
      >
        {/* Carte d'intro */}
        <div className="flex shrink-0 flex-col justify-center lg:h-screen lg:w-[28vw]">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-caramel">
            Créations signature
          </p>
          <h2 className="font-heading text-4xl font-light leading-tight text-chocolate sm:text-5xl">
            Nos pièces les plus désirées
          </h2>
          <p className="mt-5 max-w-sm text-muted-foreground">
            Une sélection de créations emblématiques, façonnées à la main et
            pensées comme des bijoux de gourmandise.
          </p>
          <Link
            href="/catalogue"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-chocolate transition-colors hover:text-gold"
          >
            Voir tout le catalogue
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Cartes éditoriales */}
        {products.map((product, i) => (
          <Link
            key={product.id}
            href={`/produit/${product.slug}`}
            className="group relative flex h-[60vh] shrink-0 flex-col overflow-hidden rounded-3xl sm:h-[70vh] lg:h-[72vh] lg:w-[36vw]"
          >
            <BrandImage
              src={product.images[0] ?? ""}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 90vw, 36vw"
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate-dark/70 via-chocolate-dark/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-xs uppercase tracking-widest text-ivory/70">
                {String(i + 1).padStart(2, "0")} — {product.category.name}
              </p>
              <h3 className="mt-2 font-heading text-3xl font-light text-ivory">
                {product.name}
              </h3>
              <p className="mt-2 text-ivory/90">
                {formatPrice(product.price / 100)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
