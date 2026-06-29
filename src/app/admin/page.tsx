import Link from "next/link";
import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import { adminRepository } from "@/repositories/admin.repository";
import { formatPrice, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/admin/revenue-chart";

export default async function AdminDashboard() {
  const [stats, series, topProducts, loyal, recent] = await Promise.all([
    adminRepository.getStats(),
    adminRepository.getRevenueSeries(30),
    adminRepository.getTopProducts(5),
    adminRepository.getLoyalCustomers(5),
    adminRepository.listOrders({ pageSize: 6 }),
  ]);

  const cards = [
    { label: "Chiffre d'affaires", value: formatPrice(stats.revenue / 100), icon: TrendingUp },
    { label: "Commandes", value: String(stats.orderCount), icon: ShoppingCart },
    { label: "Panier moyen", value: formatPrice(stats.avgBasket / 100), icon: Package },
    { label: "Clients", value: String(stats.customerCount), icon: Users },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-3xl text-chocolate">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d'ensemble de votre activité.
        </p>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-ivory p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="size-4 text-caramel" />
            </div>
            <p className="mt-3 font-heading text-2xl text-chocolate">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Graphique CA */}
      <div className="rounded-2xl border border-border bg-ivory p-6">
        <h2 className="mb-4 font-heading text-lg text-chocolate">
          Chiffre d'affaires (30 derniers jours)
        </h2>
        <RevenueChart data={series} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top produits */}
        <div className="rounded-2xl border border-border bg-ivory p-6">
          <h2 className="mb-4 font-heading text-lg text-chocolate">
            Produits les plus vendus
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune vente pour l'instant.</p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map((p, i) => (
                <li key={p.productId ?? i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3">
                    <span className="text-caramel">{i + 1}.</span>
                    <span className="text-chocolate">{p.name}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {p.quantity} vendus · {formatPrice(p.revenue / 100)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Clients fidèles */}
        <div className="rounded-2xl border border-border bg-ivory p-6">
          <h2 className="mb-4 font-heading text-lg text-chocolate">Clients les plus fidèles</h2>
          {loyal.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun client pour l'instant.</p>
          ) : (
            <ul className="space-y-3">
              {loyal.map((c, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-chocolate">
                    {c.user?.name ?? c.user?.email ?? "Client"}
                  </span>
                  <span className="text-muted-foreground">
                    {c.orders} cmd · {formatPrice(c.total / 100)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="rounded-2xl border border-border bg-ivory p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg text-chocolate">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-sm text-caramel hover:text-chocolate">
            Tout voir
          </Link>
        </div>
        {recent.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune commande.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Commande</th>
                  <th className="pb-2 font-medium">Client</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Statut</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.items.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3">
                      <Link href={`/admin/commandes/${o.id}`} className="text-chocolate hover:text-gold">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">{o.customerName}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="rounded-full text-xs">
                        {ORDER_STATUS_LABELS[o.status]}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-chocolate">
                      {formatPrice(o.total / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
