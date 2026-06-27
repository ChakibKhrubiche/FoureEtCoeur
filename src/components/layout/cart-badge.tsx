"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart-store";

/** Pastille indiquant le nombre d'articles dans le panier. */
export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  // Évite tout décalage d'hydratation (le panier vient du localStorage).
  useEffect(() => setMounted(true), []);
  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -right-0.5 -top-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-semibold text-chocolate-dark tabular-nums">
      {count > 9 ? "9+" : count}
    </span>
  );
}
