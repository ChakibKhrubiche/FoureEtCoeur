"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { couponRepository } from "@/repositories/coupon.repository";
import { computeCouponDiscount, computeTotals } from "@/lib/pricing";
import { getPaymentProvider } from "@/services/payment";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";

export interface CouponResult {
  ok: boolean;
  discount?: number; // centimes
  label?: string;
  message?: string;
}

/** Valide un code promo pour un sous-total donné (centimes MAD). */
export async function validateCouponAction(
  code: string,
  subtotal: number,
): Promise<CouponResult> {
  const coupon = await couponRepository.findValid(code);
  if (!coupon) return { ok: false, message: "Code promo invalide ou expiré." };

  const discount = computeCouponDiscount(coupon, subtotal);
  if (discount <= 0) {
    return {
      ok: false,
      message: coupon.minSubtotal
        ? `Valable dès ${(coupon.minSubtotal / 100).toFixed(0)} MAD d'achat.`
        : "Ce code ne s'applique pas à votre panier.",
    };
  }

  return {
    ok: true,
    discount,
    label: coupon.description ?? coupon.code,
  };
}

export interface CreateOrderResult {
  ok: boolean;
  orderNumber?: string;
  redirectUrl?: string | null;
  error?: string;
}

/** Génère un numéro de commande lisible : FC-AAAA-NNNN. */
async function generateOrderNumber(
  tx: Prisma.TransactionClient,
  year: number,
): Promise<string> {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const count = await tx.order.count({
    where: { createdAt: { gte: start, lt: end } },
  });
  return `FC-${year}-${String(count + 1).padStart(4, "0")}`;
}

/** Crée la commande : validation stock, totaux, décrément stock, le tout en transaction. */
export async function createOrderAction(
  input: CheckoutInput,
): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }
  const data = parsed.data;
  const user = await getCurrentUser();
  const currentYear = new Date().getFullYear();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Produits authoritatifs + contrôle de stock
      const ids = data.items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: ids }, isActive: true },
      });
      const byId = new Map(products.map((p) => [p.id, p]));

      const lines = data.items.map((item) => {
        const product = byId.get(item.productId);
        if (!product) throw new Error(`Produit indisponible.`);
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour ${product.name}.`);
        }
        return {
          product,
          quantity: item.quantity,
          unitPrice: product.price,
          lineTotal: product.price * item.quantity,
        };
      });

      const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

      // 2. Coupon (autoritatif)
      let discount = 0;
      let couponId: string | null = null;
      if (data.couponCode) {
        const coupon = await couponRepository.findValid(data.couponCode);
        if (coupon) {
          discount = computeCouponDiscount(coupon, subtotal);
          if (discount > 0) {
            couponId = coupon.id;
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }

      const totals = computeTotals(subtotal, discount);

      // 3. Adresse (snapshot)
      let shippingAddressId: string | null = null;
      let addressText = "";
      if (data.shippingAddressId && user) {
        const addr = await tx.address.findUnique({
          where: { id: data.shippingAddressId },
        });
        if (addr && addr.userId === user.id) {
          shippingAddressId = addr.id;
          addressText = `${addr.fullName}, ${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.postalCode ?? ""} ${addr.city}, ${addr.country} — ${addr.phone}`;
        }
      } else if (data.shippingAddress) {
        const a = data.shippingAddress;
        addressText = `${a.fullName}, ${a.line1}${a.line2 ? ", " + a.line2 : ""}, ${a.postalCode ?? ""} ${a.city}, ${a.country} — ${a.phone}`;
      }
      if (!addressText) throw new Error("Adresse de livraison manquante.");

      // 4. Numéro + création
      const orderNumber = await generateOrderNumber(tx, currentYear);
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id ?? null,
          customerName: data.customer.name,
          customerEmail: data.customer.email,
          customerPhone: data.customer.phone,
          shippingAddressId,
          shippingAddressText: addressText,
          paymentMethod: data.paymentMethod,
          subtotal: totals.subtotal,
          discount: totals.discount,
          shippingCost: totals.shipping,
          taxAmount: totals.vatIncluded,
          total: totals.total,
          couponId,
          notes: data.notes || null,
          items: {
            create: lines.map((l) => ({
              productId: l.product.id,
              productName: l.product.name,
              unitPrice: l.unitPrice,
              quantity: l.quantity,
              lineTotal: l.lineTotal,
            })),
          },
        },
      });

      // 5. Décrément du stock
      for (const l of lines) {
        await tx.product.update({
          where: { id: l.product.id },
          data: { stock: { decrement: l.quantity } },
        });
      }

      return { order, total: totals.total };
    });

    // 6. Paiement (hors transaction)
    const provider = getPaymentProvider(data.paymentMethod);
    const payment = await provider.init({
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      amount: result.total,
      customerEmail: data.customer.email,
    });

    if (payment.paymentStatus !== "UNPAID") {
      await prisma.order.update({
        where: { id: result.order.id },
        data: { paymentStatus: payment.paymentStatus },
      });
    }

    // TODO (Phase 6) : notification WhatsApp + e-mail de confirmation ici.

    revalidatePath("/compte/commandes");
    return {
      ok: true,
      orderNumber: result.order.orderNumber,
      redirectUrl: payment.redirectUrl,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la commande.";
    return { ok: false, error: message };
  }
}
