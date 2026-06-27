"use client";

import { useCatalogueParams } from "@/hooks/use-catalogue-params";
import { SORT_OPTIONS, DEFAULT_SORT } from "@/lib/catalogue";

/** Sélecteur de tri (synchronisé avec l'URL). */
export function CatalogueSort() {
  const { get, setParam } = useCatalogueParams();
  const value = get("tri") || DEFAULT_SORT;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tri" className="text-sm text-muted-foreground">
        Trier
      </label>
      <select
        id="tri"
        value={value}
        onChange={(e) =>
          setParam("tri", e.target.value === DEFAULT_SORT ? null : e.target.value)
        }
        className="h-10 rounded-full border border-border bg-background px-4 text-sm text-chocolate outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
