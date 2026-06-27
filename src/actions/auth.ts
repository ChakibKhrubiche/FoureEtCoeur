"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export interface AuthActionState {
  error?: string;
}

/** Connexion par identifiants. Redirige vers /compte en cas de succès. */
export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/compte",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou mot de passe incorrect." };
    }
    throw error; // laisse passer la redirection Next
  }
}

/** Inscription : crée le compte puis connecte automatiquement. */
export async function registerAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cette adresse e-mail." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/compte" });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Compte créé. Veuillez vous connecter." };
    }
    throw error;
  }
}

/** Déconnexion. */
export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

/** Connexion via Google (si configuré). */
export async function googleLoginAction() {
  await signIn("google", { redirectTo: "/compte" });
}
