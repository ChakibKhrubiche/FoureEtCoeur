import { prisma } from "@/lib/prisma";

/** Accès aux catégories. */
export const categoryRepository = {
  /** Toutes les catégories, triées par position d'affichage. */
  findAll() {
    return prisma.category.findMany({
      orderBy: { position: "asc" },
    });
  },

  /** Catégories avec le nombre de produits actifs. */
  findAllWithCount() {
    return prisma.category.findMany({
      orderBy: { position: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
  },

  findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },
};
