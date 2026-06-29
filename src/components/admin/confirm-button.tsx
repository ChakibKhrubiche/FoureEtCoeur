"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Bouton de soumission avec confirmation (à placer dans un <form action={...}>).
 */
export function ConfirmButton({
  children,
  message = "Confirmer cette action ?",
  className,
}: {
  children: ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn(
        "text-muted-foreground transition-colors hover:text-destructive",
        className,
      )}
    >
      {children}
    </button>
  );
}
