import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Votre nom est requis"),
  phone: z
    .string()
    .max(20)
    .optional()
    .or(z.literal("")),
});

export const addressSchema = z.object({
  label: z.string().max(40).optional().or(z.literal("")),
  fullName: z.string().min(2, "Nom complet requis"),
  phone: z.string().min(6, "Téléphone requis"),
  line1: z.string().min(3, "Adresse requise"),
  line2: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().optional().or(z.literal("")),
  country: z.string().min(2).default("Maroc"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
