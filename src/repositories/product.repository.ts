import { prisma } from "@/lib/prisma";
import type { Prisma, ProductBadge } from "@prisma/client";

export type ProductSort =
  | "alphabetical"
  | "price-asc"
  | "price-desc"
  | "best-sellers"
  | "newest";

export interface ProductFilters {
  categorySlugs?: string[];
  badges?: ProductBadge[];
  minPrice?: number; // centimes MAD
  maxPrice?: number;
  search?: string;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

function buildOrderBy(
  sort: ProductSort = "best-sellers",
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "alphabetical":
      return { name: "asc" };
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "best-sellers":
    default:
      return { ratingCount: "desc" };
  }
}

/** Accès aux produits (catalogue, fiche, recherche). */
export const productRepository = {
  /** Recherche paginée et filtrée pour le catalogue. */
  async search(filters: ProductFilters = {}) {
    const {
      categorySlugs,
      badges,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      pageSize = 12,
    } = filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(categorySlugs?.length
        ? { category: { slug: { in: categorySlugs } } }
        : {}),
      ...(badges?.length ? { badge: { in: badges } } : {}),
      ...(minPrice != null || maxPrice != null
        ? { price: { gte: minPrice ?? undefined, lte: maxPrice ?? undefined } }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: buildOrderBy(sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, image: true } } },
        },
      },
    });
  },

  /** Produits similaires (même catégorie). */
  findRelated(productId: string, categoryId: string, limit = 4) {
    return prisma.product.findMany({
      where: { categoryId, isActive: true, id: { not: productId } },
      orderBy: { ratingCount: "desc" },
      take: limit,
      include: { category: true },
    });
  },

  /** Best-sellers mis en avant (landing). */
  findBestSellers(limit = 6) {
    return prisma.product.findMany({
      where: { isActive: true },
      orderBy: { ratingCount: "desc" },
      take: limit,
      include: { category: true },
    });
  },

  /** Produits portant un badge (ex: NEW pour la section nouveautés). */
  findByBadge(badge: ProductBadge, limit = 6) {
    return prisma.product.findMany({
      where: { isActive: true, badge },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { category: true },
    });
  },
};
