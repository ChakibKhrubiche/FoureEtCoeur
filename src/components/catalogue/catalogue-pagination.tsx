"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCatalogueParams } from "@/hooks/use-catalogue-params";
import { cn } from "@/lib/utils";

/** Pagination du catalogue (met à jour le paramètre `page` sans reset des filtres). */
export function CataloguePagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const { setParam } = useCatalogueParams();
  if (totalPages <= 1) return null;

  const goTo = (p: number) =>
    setParam("page", p <= 1 ? null : String(p), false);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Page précédente"
        className="flex size-10 items-center justify-center rounded-full border border-border text-chocolate transition-colors hover:bg-secondary disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => goTo(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex size-10 items-center justify-center rounded-full text-sm transition-colors",
            p === page
              ? "bg-chocolate text-primary-foreground"
              : "text-chocolate hover:bg-secondary",
          )}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Page suivante"
        className="flex size-10 items-center justify-center rounded-full border border-border text-chocolate transition-colors hover:bg-secondary disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
