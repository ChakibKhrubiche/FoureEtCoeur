import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { orderRepository } from "@/repositories/order.repository";
import { formatPrice, formatDate } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "@/types/order";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await orderRepository.findById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-chocolate"
      >
        <ArrowLeft className="size-4" />
        Retour aux commandes
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-chocolate">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} current={order.status} />
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Articles */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-ivory p-6">
          <h2 className="mb-4 font-heading text-lg text-chocolate">Articles</h2>
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <span className="text-chocolate">
                  {item.quantity} × {item.productName}
                </span>
                <span className="text-muted-foreground">{formatPrice(item.lineTotal / 100)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Sous-total" value={formatPrice(order.subtotal / 100)} />
            {order.discount > 0 && <Row label="Réduction" value={`− ${formatPrice(order.discount / 100)}`} />}
            <Row label="Livraison" value={order.shippingCost === 0 ? "Offerte" : formatPrice(order.shippingCost / 100)} />
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <dt className="font-medium text-chocolate">Total</dt>
              <dd className="font-heading text-lg text-chocolate">{formatPrice(order.total / 100)}</dd>
            </div>
          </dl>
        </div>

        {/* Client & livraison */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-ivory p-6 text-sm">
            <h2 className="mb-3 font-heading text-lg text-chocolate">Client</h2>
            <p className="text-chocolate">{order.customerName}</p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
            <p className="text-muted-foreground">{order.customerPhone}</p>
          </div>
          <div className="rounded-2xl border border-border bg-ivory p-6 text-sm">
            <h2 className="mb-3 font-heading text-lg text-chocolate">Livraison</h2>
            <p className="text-muted-foreground">{order.shippingAddressText}</p>
          </div>
          <div className="rounded-2xl border border-border bg-ivory p-6 text-sm">
            <h2 className="mb-3 font-heading text-lg text-chocolate">Paiement</h2>
            <p className="text-muted-foreground">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
            <p className="text-muted-foreground">{PAYMENT_STATUS_LABELS[order.paymentStatus]}</p>
          </div>
          {order.notes && (
            <div className="rounded-2xl border border-border bg-ivory p-6 text-sm">
              <h2 className="mb-3 font-heading text-lg text-chocolate">Note</h2>
              <p className="text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-chocolate">{value}</dd>
    </div>
  );
}
