import type { Product, Category, ProductBadge } from "@prisma/client";

/** Produit accompagné de sa catégorie (forme renvoyée par les repositories). */
export type ProductWithCategory = Product & { category: Category };

/** Libellés FR des badges produit. */
export const BADGE_LABELS: Record<ProductBadge, string> = {
  NEW: "Nouveau",
  BEST_SELLER: "Best-seller",
  LIMITED_EDITION: "Édition limitée",
};
