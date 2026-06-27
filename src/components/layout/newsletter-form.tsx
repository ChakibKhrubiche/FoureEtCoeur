"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Formulaire d'inscription à la newsletter.
 * Branchement à un service d'e-mailing prévu en Phase 6 (Resend / liste).
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    setLoading(true);
    // TODO (Phase 6) : appeler l'action serveur d'inscription newsletter.
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setEmail("");
    toast.success("Merci ! Vous êtes bien inscrit·e.");
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre e-mail"
        aria-label="Adresse e-mail"
        className="bg-background"
      />
      <Button type="submit" disabled={loading} className="shrink-0">
        {loading ? "…" : "S'inscrire"}
      </Button>
    </form>
  );
}
