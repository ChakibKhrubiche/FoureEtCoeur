import type { ProductFilters, ProductSort } from "@/repositories/product.repository";
import type { ProductBadge } from "@prisma/client";

/** Options de tri exposées dans l'UI (valeurs présentes dans l'URL). */
export const SORT_OPTIONS = [
  { value: "plus-vendus", label: "Les plus populaires" },
  { value: "plus-recents", label: "Nouveautés" },
  { value: "prix-croissant", label: "Prix croissant" },
  { value: "prix-decroissant", label: "Prix décroissant" },
  { value: "alphabetique", label: "Alphabétique (A→Z)" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
export const DEFAULT_SORT: SortValue = "plus-vendus";

const SORT_MAP: Record<SortValue, ProductSort> = {
  "plus-vendus": "best-sellers",
  "plus-recents": "newest",
  "prix-croissant": "price-asc",
  "prix-decroissant": "price-desc",
  alphabetique: "alphabetical",
};

export const PAGE_SIZE = 12;

/** Type souple des searchParams (string | string[] | undefined). */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Transforme les searchParams (URL) en filtres pour le repository. */
export function parseCatalogueParams(sp: RawSearchParams): ProductFilters {
  const categorie = first(sp.categorie);
  const badge = first(sp.badge);
  const prixMin = first(sp.prix_min);
  const prixMax = first(sp.prix_max);
  const sortValue = (first(sp.tri) ?? DEFAULT_SORT) as SortValue;
  const page = Number(first(sp.page) ?? "1");

  return {
    categorySlugs: categorie ? categorie.split(",").filter(Boolean) : undefined,
    badges: badge
      ? (badge.split(",").filter(Boolean) as ProductBadge[])
      : undefined,
    // L'UI saisit des MAD ; le repository attend des centimes.
    minPrice: prixMin ? Math.round(Number(prixMin) * 100) : undefined,
    maxPrice: prixMax ? Math.round(Number(prixMax) * 100) : undefined,
    search: first(sp.q) || undefined,
    sort: SORT_MAP[sortValue] ?? "best-sellers",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: PAGE_SIZE,
  };
}
