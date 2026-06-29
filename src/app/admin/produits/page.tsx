import Link from "next/link";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import { adminRepository } from "@/repositories/admin.repository";
import { deleteProductAction } from "@/actions/admin";
import { formatPrice } from "@/lib/format";
import { BADGE_LABELS } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/ui/brand-image";
import { AdminSearch } from "@/components/admin/admin-search";
import { ConfirmButton } from "@/components/admin/confirm-button";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const { items, total, totalPages } = await adminRepository.listProducts({
    search: sp.q,
    page,
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-chocolate">Produits</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} produit(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <a href="/admin/produits/export">
              <Download className="size-4" />
              Export CSV
            </a>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/admin/produits/nouveau">
              <Plus className="size-4" />
              Nouveau produit
            </Link>
          </Button>
        </div>
      </header>

      <AdminSearch placeholder="Rechercher un produit…" />

      <div className="overflow-x-auto rounded-2xl border border-border bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Produit</th>
              <th className="p-4 font-medium">Catégorie</th>
              <th className="p-4 font-medium">Prix</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">État</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-border/50 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                      <BrandImage src={p.images[0] ?? ""} alt={p.name} fill sizes="48px" className="h-full w-full" />
                    </div>
                    <div>
                      <p className="font-medium text-chocolate">{p.name}</p>
                      {p.badge && (
                        <Badge variant="outline" className="mt-1 rounded-full text-[0.65rem]">
                          {BADGE_LABELS[p.badge]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{p.category.name}</td>
                <td className="p-4 text-chocolate">{formatPrice(p.price / 100)}</td>
                <td className="p-4 text-muted-foreground">{p.stock}</td>
                <td className="p-4">
                  <span
                    className={
                      p.isActive
                        ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                        : "rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                    }
                  >
                    {p.isActive ? "Actif" : "Masqué"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/produits/${p.id}`}
                      className="text-muted-foreground hover:text-chocolate"
                      aria-label="Modifier"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <form action={deleteProductAction.bind(null, p.id)}>
                      <ConfirmButton message={`Supprimer « ${p.name} » ?`}>
                        <Trash2 className="size-4" />
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  Aucun produit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (sp.q) params.set("q", sp.q);
            if (p > 1) params.set("page", String(p));
            const qs = params.toString();
            return (
              <Link
                key={p}
                href={qs ? `/admin/produits?${qs}` : "/admin/produits"}
                className={
                  p === page
                    ? "flex size-9 items-center justify-center rounded-full bg-chocolate text-sm text-primary-foreground"
                    : "flex size-9 items-center justify-center rounded-full border border-border text-sm text-chocolate hover:bg-secondary"
                }
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
