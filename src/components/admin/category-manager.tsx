"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { Category } from "@prisma/client";
import { saveCategoryAction, deleteCategoryAction, type AdminActionState } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmButton } from "@/components/admin/confirm-button";

type CatWithCount = Category & { _count: { products: number } };

export function CategoryManager({ categories }: { categories: CatWithCount[] }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [state, action, pending] = useActionState<AdminActionState, FormData>(
    saveCategoryAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Catégorie enregistrée");
      formRef.current?.reset();
      setEditing(null);
    }
  }, [state]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Liste */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Nom</th>
              <th className="p-4 font-medium">Produits</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border/50 last:border-0">
                <td className="p-4">
                  <p className="font-medium text-chocolate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">/{c.slug}</p>
                </td>
                <td className="p-4 text-muted-foreground">{c._count.products}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(c);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-muted-foreground hover:text-chocolate"
                      aria-label="Modifier"
                    >
                      <Pencil className="size-4" />
                    </button>
                    {c._count.products === 0 ? (
                      <form action={deleteCategoryAction.bind(null, c.id)}>
                        <ConfirmButton message={`Supprimer « ${c.name} » ?`}>
                          <Trash2 className="size-4" />
                        </ConfirmButton>
                      </form>
                    ) : (
                      <span className="text-xs text-muted-foreground/60" title="Catégorie non vide">
                        —
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulaire */}
      <form
        ref={formRef}
        action={action}
        key={editing?.id ?? "new"}
        className="h-fit rounded-2xl border border-border bg-ivory p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg text-chocolate">
          {editing ? <Pencil className="size-4" /> : <Plus className="size-4" />}
          {editing ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </h2>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={editing?.name} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug (auto si vide)</Label>
            <Input id="slug" name="slug" defaultValue={editing?.slug} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={editing?.description ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Image (URL)</Label>
            <Input id="image" name="image" defaultValue={editing?.image ?? ""} placeholder="/images/products/..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" name="position" type="number" defaultValue={editing?.position?.toString() ?? "0"} />
          </div>
        </div>

        {state.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}

        <div className="mt-6 flex gap-2">
          <Button type="submit" disabled={pending} className="rounded-full">
            {pending ? "…" : editing ? "Mettre à jour" : "Ajouter"}
          </Button>
          {editing && (
            <Button type="button" variant="ghost" onClick={() => setEditing(null)} className="rounded-full">
              Annuler
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
