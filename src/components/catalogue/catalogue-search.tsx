"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useCatalogueParams } from "@/hooks/use-catalogue-params";

/** Recherche instantanée (débounce 300 ms), synchronisée avec l'URL. */
export function CatalogueSearch() {
  const { get, setParam } = useCatalogueParams();
  const [value, setValue] = useState(get("q"));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-synchronise si l'URL change depuis l'extérieur (ex: reset).
  useEffect(() => {
    setValue(get("q"));
  }, [get]);

  function onChange(next: string) {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setParam("q", next || null);
    }, 300);
  }

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une création…"
        aria-label="Rechercher"
        className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-9 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-chocolate"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
