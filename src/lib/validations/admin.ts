import { z } from "zod";
import { ProductBadge } from "@prisma/client";

/** Slugify simple (sans accents, kebab-case). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const productSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2),
  description: z.string().min(5, "Description requise"),
  price: z.number().int().nonnegative(), // centimes MAD
  compareAtPrice: z.number().int().positive().nullable(),
  categoryId: z.string().min(1, "Catégorie requise"),
  images: z.array(z.string()),
  weightGrams: z.number().int().positive().nullable(),
  allergens: z.array(z.string()),
  ingredients: z.array(z.string()),
  stock: z.number().int().nonnegative(),
  badge: z.nativeEnum(ProductBadge).nullable(),
  isActive: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  position: z.number().int().nonnegative(),
});

/** Parse une liste depuis une saisie texte (séparée par virgules ou retours ligne). */
export function parseList(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse un prix MAD (ex: "139" ou "139,50") en centimes. */
export function parsePriceToCents(value: FormDataEntryValue | null): number {
  if (value == null || value === "") return 0;
  const normalized = String(value).replace(",", ".").trim();
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}
