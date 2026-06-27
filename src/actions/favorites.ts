"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { favoriteRepository } from "@/repositories/favorite.repository";

export interface ToggleFavoriteResult {
  needAuth?: boolean;
  active?: boolean;
}

/** Ajoute/retire un favori. Renvoie needAuth si l'utilisateur n'est pas connecté. */
export async function toggleFavoriteAction(
  productId: string,
): Promise<ToggleFavoriteResult> {
  const user = await getCurrentUser();
  if (!user) return { needAuth: true };

  const active = await favoriteRepository.toggle(user.id, productId);
  revalidatePath("/compte/favoris");
  return { active };
}
