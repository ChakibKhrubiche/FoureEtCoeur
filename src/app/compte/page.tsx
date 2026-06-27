import Link from "next/link";
import { Package, Heart, MapPin, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { orderRepository } from "@/repositories/order.repository";
import { formatPrice, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { Badge } from "@/components/ui/badge";

export default async function AccountDashboard() {
  const user = await requireUser();

  const [orderCount, favoriteCount, addressCount, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { userId: user.id } }),
      prisma.favorite.count({ where: { userId: user.id } }),
      prisma.address.count({ where: { userId: user.id } }),
      orderRepository.findByUser(user.id),
    ]);

  const stats = [
    { label: "Commandes", value: orderCount, icon: Package, href: "/compte/commandes" },
    { label: "Favoris", value: favoriteCount, icon: Heart, href: "/compte/favoris" },
    { label: "Adresses", value: addressCount, icon: MapPin, href: "/compte/adresses" },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-border bg-warm-white p-6 transition-colors hover:border-gold"
          >
            <stat.icon className="size-5 text-caramel" />
            <p className="mt-4 font-heading text-3xl text-chocolate">
              {stat.value}
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              {stat.label}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="font-heading text-2xl text-chocolate">
          Commandes récentes
        </h2>
        {recentOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Link
              href="/catalogue"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-chocolate hover:text-gold"
            >
              Découvrir le catalogue
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-warm-white p-5"
              >
                <div>
                  <p className="font-medium text-chocolate">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)} · {order.items.length} article
                    {order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="rounded-full">
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <span className="font-medium text-chocolate">
                    {formatPrice(order.total / 100)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
