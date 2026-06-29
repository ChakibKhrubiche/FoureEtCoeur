import { prisma } from "@/lib/prisma";
import type { OrderStatus, Prisma } from "@prisma/client";

/** Requêtes réservées à l'administration (incluent les éléments inactifs). */
export const adminRepository = {
  // ---------------- Statistiques ----------------
  async getStats() {
    const notCancelled: Prisma.OrderWhereInput = { status: { not: "CANCELLED" } };

    const [revenueAgg, orderCount, productCount, customerCount] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: notCancelled }),
      prisma.order.count({ where: notCancelled }),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

    const revenue = revenueAgg._sum.total ?? 0;
    const avgBasket = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    return { revenue, orderCount, productCount, customerCount, avgBasket };
  },

  /** Chiffre d'affaires des 30 derniers jours, agrégé par jour (centimes MAD). */
  async getRevenueSeries(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days + 1);
    since.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: { status: { not: "CANCELLED" }, createdAt: { gte: since } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: "asc" },
    });

    const byDay = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      byDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + o.total);
    }
    return Array.from(byDay, ([date, total]) => ({ date, total }));
  },

  /** Produits les plus vendus (par quantité). */
  async getTopProducts(limit = 5) {
    const grouped = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true, lineTotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    });
    return grouped.map((g) => ({
      productId: g.productId,
      name: g.productName,
      quantity: g._sum.quantity ?? 0,
      revenue: g._sum.lineTotal ?? 0,
    }));
  },

  /** Clients les plus fidèles (par dépense cumulée). */
  async getLoyalCustomers(limit = 5) {
    const grouped = await prisma.order.groupBy({
      by: ["userId"],
      where: { status: { not: "CANCELLED" }, userId: { not: null } },
      _sum: { total: true },
      _count: { _all: true },
      orderBy: { _sum: { total: "desc" } },
      take: limit,
    });
    const ids = grouped.map((g) => g.userId!).filter(Boolean);
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, email: true },
    });
    const byId = new Map(users.map((u) => [u.id, u]));
    return grouped.map((g) => ({
      user: byId.get(g.userId!),
      total: g._sum.total ?? 0,
      orders: g._count._all,
    }));
  },

  // ---------------- Produits ----------------
  async listProducts(opts: { search?: string; page?: number; pageSize?: number } = {}) {
    const { search, page = 1, pageSize = 15 } = opts;
    const where: Prisma.ProductWhereInput = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  getProduct(id: string) {
    return prisma.product.findUnique({ where: { id }, include: { category: true } });
  },

  allProductsForExport() {
    return prisma.product.findMany({ include: { category: true }, orderBy: { name: "asc" } });
  },

  // ---------------- Commandes ----------------
  async listOrders(opts: { status?: OrderStatus; search?: string; page?: number; pageSize?: number } = {}) {
    const { status, search, page = 1, pageSize = 15 } = opts;
    const where: Prisma.OrderWhereInput = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              { customerName: { contains: search, mode: "insensitive" } },
              { customerEmail: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  allOrdersForExport() {
    return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  },

  // ---------------- Utilisateurs ----------------
  async listUsers(opts: { search?: string } = {}) {
    const { search } = opts;
    return prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  },
};
