"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import {
  productSchema,
  categorySchema,
  slugify,
  parseList,
  parsePriceToCents,
} from "@/lib/validations/admin";

export interface AdminActionState {
  error?: string;
  success?: boolean;
}

function buildProductData(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const compareRaw = formData.get("compareAtPrice");
  const weightRaw = formData.get("weightGrams");
  const badgeRaw = String(formData.get("badge") ?? "");

  return {
    name,
    slug: slugRaw ? slugify(slugRaw) : slugify(name),
    description: String(formData.get("description") ?? ""),
    price: parsePriceToCents(formData.get("price")),
    compareAtPrice:
      compareRaw && String(compareRaw).trim()
        ? parsePriceToCents(compareRaw)
        : null,
    categoryId: String(formData.get("categoryId") ?? ""),
    images: parseList(formData.get("images")),
    weightGrams:
      weightRaw && String(weightRaw).trim() ? Number(weightRaw) : null,
    allergens: parseList(formData.get("allergens")),
    ingredients: parseList(formData.get("ingredients")),
    stock: Number(formData.get("stock") ?? 0),
    badge: badgeRaw ? (badgeRaw as never) : null,
    isActive: formData.get("isActive") === "on",
  };
}

// ---------------- Produits ----------------
export async function createProductAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(buildProductData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }
  const exists = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) return { error: "Un produit avec ce slug existe déjà." };

  await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function updateProductAction(
  id: string,
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(buildProductData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }
  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/produits");
  revalidatePath(`/produit/${parsed.data.slug}`);
  redirect("/admin/produits");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produits");
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/produits");
}

// ---------------- Catégories ----------------
export async function saveCategoryAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const data = {
    name,
    slug: slugRaw ? slugify(slugRaw) : slugify(name),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    position: Number(formData.get("position") ?? 0),
  };
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  if (id) {
    await prisma.category.update({ where: { id }, data: parsed.data });
  } else {
    const exists = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
    if (exists) return { error: "Une catégorie avec ce slug existe déjà." };
    await prisma.category.create({ data: parsed.data });
  }
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return; // protégé : catégorie non vide
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// ---------------- Commandes ----------------
export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${id}`);
}
