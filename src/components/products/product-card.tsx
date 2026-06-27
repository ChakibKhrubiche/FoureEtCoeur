"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import { BrandImage } from "@/components/ui/brand-image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BADGE_LABELS, type ProductWithCategory } from "@/types/product";
import { FavoriteButton } from "@/components/products/favorite-button";

export function ProductCard({
  product,
  isFavorite = false,
  className,
}: {
  product: ProductWithCategory;
  isFavorite?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", className)}
    >
      <Link href={`/produit/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
          <BrandImage
            src={product.images[0] ?? ""}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {product.badge && (
            <Badge className="absolute left-3 top-3 rounded-full border-none bg-ivory/90 text-chocolate backdrop-blur-sm">
              {BADGE_LABELS[product.badge]}
            </Badge>
          )}

          <div className="absolute right-3 top-3">
            <FavoriteButton productId={product.id} initialActive={isFavorite} />
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] uppercase tracking-widest text-caramel">
              {product.category.name}
            </p>
            <h3 className="mt-1 truncate font-heading text-lg text-chocolate">
              {product.name}
            </h3>
          </div>
          <p className="shrink-0 font-medium text-chocolate">
            {formatPrice(product.price / 100)}
          </p>
        </div>

        {product.ratingCount > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-gold text-gold" />
            <span>
              {product.ratingAvg.toFixed(1)} ({product.ratingCount})
            </span>
          </div>
        )}
      </Link>
    </motion.article>
  );
}
