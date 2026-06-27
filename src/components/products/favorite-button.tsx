"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/actions/favorites";

/**
 * Bouton favori connecté : persiste en base via server action.
 * Si l'utilisateur n'est pas connecté, propose de se connecter.
 */
export function FavoriteButton({
  productId,
  initialActive = false,
  className,
}: {
  productId: string;
  initialActive?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleFavoriteAction(productId);
      if (result.needAuth) {
        toast.error("Connectez-vous pour enregistrer vos favoris", {
          action: {
            label: "Se connecter",
            onClick: () => router.push("/connexion"),
          },
        });
        return;
      }
      setActive(!!result.active);
      toast.success(result.active ? "Ajouté aux favoris" : "Retiré des favoris");
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-ivory/90 text-chocolate backdrop-blur-sm transition-colors hover:bg-ivory disabled:opacity-60",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-all",
          active ? "fill-red-500 text-red-500" : "text-chocolate",
        )}
      />
    </button>
  );
}
