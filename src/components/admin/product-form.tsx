"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Category, Product } from "@prisma/client";
import {
  createProductAction,
  updateProductAction,
  type AdminActionState,
} from "@/actions/admin";
import { BADGE_LABELS } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState<AdminActionState, FormData>(
    action,
    {},
  );

  const toMad = (cents?: number | null) =>
    cents != null ? (cents / 100).toString() : "";

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" name="name" defaultValue={product?.name} required className="sm:col-span-2" />
        <Field
          label="Slug (laisser vide pour auto)"
          name="slug"
          defaultValue={product?.slug}
          placeholder="ex: cookie-choco-caramel"
        />
        <div className="grid gap-2">
          <Label htmlFor="categoryId">Catégorie</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            required
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="" disabled>
              Choisir…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product?.description}
            rows={4}
            required
          />
        </div>

        <Field label="Prix (MAD)" name="price" type="text" inputMode="decimal" defaultValue={toMad(product?.price)} required />
        <Field label="Prix barré (MAD, optionnel)" name="compareAtPrice" type="text" inputMode="decimal" defaultValue={toMad(product?.compareAtPrice)} />
        <Field label="Stock" name="stock" type="number" defaultValue={product?.stock?.toString() ?? "0"} required />
        <Field label="Poids (g, optionnel)" name="weightGrams" type="number" defaultValue={product?.weightGrams?.toString() ?? ""} />

        <div className="grid gap-2">
          <Label htmlFor="badge">Badge</Label>
          <select
            id="badge"
            name="badge"
            defaultValue={product?.badge ?? ""}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">Aucun</option>
            {Object.entries(BADGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 text-sm text-chocolate">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product ? product.isActive : true}
              className="size-4 accent-chocolate"
            />
            Actif (visible sur le site)
          </label>
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="images">Images (une URL par ligne)</Label>
          <Textarea
            id="images"
            name="images"
            defaultValue={product?.images.join("\n")}
            rows={2}
            placeholder="/images/products/mon-produit.jpg"
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="ingredients">Ingrédients (séparés par des virgules)</Label>
          <Textarea id="ingredients" name="ingredients" defaultValue={product?.ingredients.join(", ")} rows={2} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="allergens">Allergènes (séparés par des virgules)</Label>
          <Input id="allergens" name="allergens" defaultValue={product?.allergens.join(", ")} />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? "Enregistrement…" : product ? "Mettre à jour" : "Créer le produit"}
        </Button>
        <Button asChild variant="ghost" className="rounded-full">
          <Link href="/admin/produits">Annuler</Link>
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  className,
  ...props
}: { label: string; name: string; className?: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
