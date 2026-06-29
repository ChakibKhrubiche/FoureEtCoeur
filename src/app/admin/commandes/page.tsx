import Link from "next/link";
import { Download } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { adminRepository } from "@/repositories/admin.repository";
import { formatPrice, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminSearch } from "@/components/admin/admin-search";
import { cn } from "@/lib/utils";

const STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = STATUSES.includes(sp.status as OrderStatus)
    ? (sp.status as OrderStatus)
    : undefined;

  const { items, total, totalPages } = await adminRepository.listOrders({
    search: sp.q,
    status,
    page,
  });

  function filterHref(s?: string) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (s) params.set("status", s);
    const qs = params.toString();
    return qs ? `/admin/commandes?${qs}` : "/admin/commandes";
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-chocolate">Commandes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} commande(s)</p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <a href="/admin/commandes/export">
            <Download className="size-4" />
            Export CSV
          </a>
        </Button>
      </header>

      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={filterHref()}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm",
            !status ? "bg-chocolate text-primary-foreground" : "border border-border text-chocolate hover:bg-secondary",
          )}
        >
          Toutes
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={filterHref(s)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm",
              status === s ? "bg-chocolate text-primary-foreground" : "border border-border text-chocolate hover:bg-secondary",
            )}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <AdminSearch placeholder="N° commande, nom, e-mail…" />

      <div className="overflow-x-auto rounded-2xl border border-border bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Commande</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Articles</th>
              <th className="p-4 font-medium">Statut</th>
              <th className="p-4 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.id} className="border-b border-border/50 last:border-0">
                <td className="p-4">
                  <Link href={`/admin/commandes/${o.id}`} className="font-medium text-chocolate hover:text-gold">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground">{o.customerName}</td>
                <td className="p-4 text-muted-foreground">{formatDate(o.createdAt)}</td>
                <td className="p-4 text-muted-foreground">{o.items.length}</td>
                <td className="p-4">
                  <Badge variant="outline" className="rounded-full text-xs">
                    {ORDER_STATUS_LABELS[o.status]}
                  </Badge>
                </td>
                <td className="p-4 text-right text-chocolate">{formatPrice(o.total / 100)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  Aucune commande.
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
            if (status) params.set("status", status);
            if (p > 1) params.set("page", String(p));
            const qs = params.toString();
            return (
              <Link
                key={p}
                href={qs ? `/admin/commandes?${qs}` : "/admin/commandes"}
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
