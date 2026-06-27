import { z } from "zod";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Votre panier est vide"),
  customer: z.object({
    name: z.string().min(2, "Nom requis"),
    email: z.string().email("E-mail invalide"),
    phone: z.string().min(6, "Téléphone requis"),
  }),
  shippingAddressId: z.string().optional().nullable(),
  shippingAddress: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(6),
      line1: z.string().min(3, "Adresse requise"),
      line2: z.string().optional().or(z.literal("")),
      city: z.string().min(2, "Ville requise"),
      postalCode: z.string().optional().or(z.literal("")),
      country: z.string().min(2).default("Maroc"),
    })
    .optional()
    .nullable(),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "STRIPE", "PAYPAL"]),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
