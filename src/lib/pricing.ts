import { siteConfig } from "@/config/site";
import type { Coupon } from "@prisma/client";

/** Tous les montants sont en centimes de MAD. */

/** Frais de livraison forfaitaires. */
export const SHIPPING_FLAT = 3000; // 30,00 MAD
/** Livraison offerte à partir de ce sous-total. */
export const FREE_SHIPPING_THRESHOLD = 50000; // 500,00 MAD

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  /** TVA incluse dans le total (informatif). */
  vatIncluded: number;
  total: number;
}

/** Calcule la réduction d'un coupon pour un sous-total donné (centimes). */
export function computeCouponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;
  const raw =
    coupon.discountType === "PERCENTAGE"
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : coupon.discountValue;
  return Math.min(raw, subtotal);
}

/** Calcule les totaux d'une commande. */
export function computeTotals(subtotal: number, discount = 0): OrderTotals {
  const discounted = Math.max(0, subtotal - discount);
  const shipping =
    subtotal === 0 || discounted >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = discounted + shipping;
  // Prix TTC : on isole la part de TVA contenue dans le total.
  const vatIncluded = Math.round(total - total / (1 + siteConfig.vatRate));
  return { subtotal, discount, shipping, vatIncluded, total };
}
