"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { addressRepository } from "@/repositories/address.repository";
import { profileSchema, addressSchema } from "@/lib/validations/account";

export interface ActionState {
  error?: string;
  success?: boolean;
}

/** Met à jour le profil (nom, téléphone). */
export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  });
  revalidatePath("/compte/profil");
  revalidatePath("/compte");
  return { success: true };
}

/** Crée une nouvelle adresse. */
export async function createAddressAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Adresse invalide." };
  }

  const { label, line2, postalCode, ...rest } = parsed.data;
  await addressRepository.create(user.id, {
    ...rest,
    label: label || null,
    line2: line2 || null,
    postalCode: postalCode || null,
  });
  revalidatePath("/compte/adresses");
  return { success: true };
}

/** Supprime une adresse (de l'utilisateur courant uniquement). */
export async function deleteAddressAction(addressId: string) {
  const user = await requireUser();
  const address = await addressRepository.findById(addressId);
  if (address?.userId !== user.id) return;
  await addressRepository.delete(addressId);
  revalidatePath("/compte/adresses");
}

/** Définit l'adresse par défaut. */
export async function setDefaultAddressAction(addressId: string) {
  const user = await requireUser();
  const address = await addressRepository.findById(addressId);
  if (address?.userId !== user.id) return;
  await addressRepository.setDefault(user.id, addressId);
  revalidatePath("/compte/adresses");
}
