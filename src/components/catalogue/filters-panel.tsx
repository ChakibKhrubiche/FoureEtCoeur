"use client";

import { useCatalogueParams } from "@/hooks/use-catalogue-params";
import { BADGE_LABELS } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CategoryOption {
  slug: string;
  name: string;
  count: number;
}

const BADGES = Object.entries(BADGE_LABELS) as [keyof typeof BADGE_LABELS, string][];

export function FiltersPanel({ categories }: { categories: CategoryOption[] }) {
  const { get, getList, setParam, toggleInList, reset } = useCatalogueParams();

  const selectedCategories = getList("categorie");
  const selectedBadges = getList("badge");
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBadges.length > 0 ||
    !!get("prix_min") ||
    !!get("prix_max");

  return (
    <div className="space-y-8">
      {/* Catégories */}
      <fieldset>
        <legend className="mb-4 text-xs font-medium uppercase tracking-widest text-caramel">
          Catégories
        </legend>
        <ul className="space-y-2.5">
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat.slug);
            return (
              <li key={cat.slug}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-chocolate/90 hover:text-chocolate">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleInList("categorie", cat.slug)}
                    className="size-4 rounded border-border text-chocolate accent-chocolate"
                  />
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {cat.count}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {/* Prix */}
      <fieldset>
        <legend className="mb-4 text-xs font-medium uppercase tracking-widest text-caramel">
          Prix (MAD)
        </legend>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="prix_min" className="sr-only">
              Prix minimum
            </Label>
            <Input
              id="prix_min"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Min"
              defaultValue={get("prix_min")}
              onBlur={(e) => setParam("prix_min", e.target.value || null)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  setParam("prix_min", e.currentTarget.value || null);
              }}
            />
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1">
            <Label htmlFor="prix_max" className="sr-only">
              Prix maximum
            </Label>
            <Input
              id="prix_max"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Max"
              defaultValue={get("prix_max")}
              onBlur={(e) => setParam("prix_max", e.target.value || null)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  setParam("prix_max", e.currentTarget.value || null);
              }}
            />
          </div>
        </div>
      </fieldset>

      {/* Badges */}
      <fieldset>
        <legend className="mb-4 text-xs font-medium uppercase tracking-widest text-caramel">
          Sélections
        </legend>
        <ul className="space-y-2.5">
          {BADGES.map(([value, label]) => (
            <li key={value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-chocolate/90 hover:text-chocolate">
                <input
                  type="checkbox"
                  checked={selectedBadges.includes(value)}
                  onChange={() => toggleInList("badge", value)}
                  className="size-4 rounded border-border accent-chocolate"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-muted-foreground"
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}
