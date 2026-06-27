import type { PaymentMethod } from "@prisma/client";
import type { PaymentProvider } from "./types";

/** Paiement à la livraison : aucune transaction en ligne. */
const cashOnDelivery: PaymentProvider = {
  method: "CASH_ON_DELIVERY",
  async init() {
    return { paymentStatus: "UNPAID", redirectUrl: null };
  },
};

/**
 * Registre des moyens de paiement disponibles.
 * Pour ajouter Stripe/PayPal : implémenter PaymentProvider et l'enregistrer ici.
 */
const providers: Partial<Record<PaymentMethod, PaymentProvider>> = {
  CASH_ON_DELIVERY: cashOnDelivery,
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  const provider = providers[method];
  if (!provider) {
    throw new Error(`Moyen de paiement non disponible : ${method}`);
  }
  return provider;
}

export const AVAILABLE_PAYMENT_METHODS = Object.keys(providers) as PaymentMethod[];
