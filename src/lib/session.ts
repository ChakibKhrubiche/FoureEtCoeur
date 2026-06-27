import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Retourne l'utilisateur de la session courante (ou null). */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Exige une session ; redirige vers /connexion sinon. Retourne l'utilisateur. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

/** Exige le rôle ADMIN ; redirige sinon. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
