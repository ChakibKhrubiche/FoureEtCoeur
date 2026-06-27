import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { orderRepository } from "@/repositories/order.repository";
import { formatPrice, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types/order";
import { Badge } from "@/components/ui/badge";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await orderRepository.findByUser(user.id);

  return (
    <div>
      <h2 className="font-heading text-2xl text-chocolate">Mes commandes</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Suivez l&apos;état de vos commandes en cours et passées.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">Aucune commande pour le moment.</p>
          <Link
            href="/catalogue"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-chocolate hover:text-gold"
          >
            Passer ma première commande
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-border bg-warm-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-chocolate">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)} ·{" "}
                    {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>

              <ul className="mt-4 space-y-1 border-t border-border pt-4 text-sm text-muted-foreground">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity} × {item.productName}
                    </span>
                    <span>{formatPrice(item.lineTotal / 100)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-medium text-chocolate">
                  {formatPrice(order.total / 100)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
