import { prisma } from "@/lib/prisma";

export const orderRepository = {
  /** Commandes d'un utilisateur (historique). */
  findByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  },

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true, shippingAddress: true },
    });
  },

  findByNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, shippingAddress: true },
    });
  },
};
