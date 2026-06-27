import { prisma } from "@/lib/prisma";

export const couponRepository = {
  /** Retourne le coupon s'il est valide (actif, dans les dates, usages restants). */
  async findValid(code: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
    if (!coupon || !coupon.isActive) return null;

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) return null;
    if (coupon.expiresAt && coupon.expiresAt < now) return null;
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses)
      return null;

    return coupon;
  },
};
