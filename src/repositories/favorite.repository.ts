import { prisma } from "@/lib/prisma";

export const favoriteRepository = {
  /** IDs des produits favoris d'un utilisateur (pour pré-cocher les cœurs). */
  async getProductIds(userId: string): Promise<Set<string>> {
    const rows = await prisma.favorite.findMany({
      where: { userId },
      select: { productId: true },
    });
    return new Set(rows.map((r) => r.productId));
  },

  /** Produits favoris complets (page favoris). */
  findByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { product: { include: { category: true } } },
    });
  },

  async toggle(userId: string, productId: string): Promise<boolean> {
    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return false;
    }
    await prisma.favorite.create({ data: { userId, productId } });
    return true;
  },
};
