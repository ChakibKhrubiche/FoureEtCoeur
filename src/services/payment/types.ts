import type { PaymentMethod } from "@prisma/client";

export interface PaymentInitInput {
  orderId: string;
  orderNumber: string;
  amount: number; // centimes MAD
  customerEmail: string;
}

export interface PaymentInitResult {
  /** Statut de paiement initial à enregistrer sur la commande. */
  paymentStatus: "UNPAID" | "PAID";
  /** URL de redirection éventuelle (Stripe/PayPal) — null pour COD. */
  redirectUrl: string | null;
}

/**
 * Contrat commun à tous les moyens de paiement.
 * Permet d'ajouter Stripe / PayPal sans toucher au reste du code.
 */
export interface PaymentProvider {
  readonly method: PaymentMethod;
  init(input: PaymentInitInput): Promise<PaymentInitResult>;
}
