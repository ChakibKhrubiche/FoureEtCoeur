import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte Four & Cœur pour commander en ligne.",
};

export default async function InscriptionPage() {
  if (await getCurrentUser()) redirect("/compte");

  return (
    <AuthShell
      title="Rejoignez la maison"
      subtitle="Créez votre compte pour commander et suivre vos créations."
    >
      <RegisterForm />
    </AuthShell>
  );
}
