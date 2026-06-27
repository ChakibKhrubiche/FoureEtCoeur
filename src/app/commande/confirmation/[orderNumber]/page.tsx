import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { orderRepository } from "@/repositories/order.repository";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, ORDER_STATUS_LABELS } from "@/types/order";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await orderRepository.findByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="bg-ivory pb-24 pt-28 md:pt-32">
      <div className="container-px mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto size-14 text-green-600" />
        <h1 className="mt-6 font-heading text-4xl font-light text-chocolate">
          Merci pour votre commande !
        </h1>
        <p className="mt-3 text-muted-foreground">
          Votre commande <strong className="text-chocolate">{order.orderNumber}</strong>{" "}
          a bien été enregistrée. Un récapitulatif vous sera envoyé.
        </p>

        <div className="mt-10 rounded-3xl border border-border bg-warm-white p-8 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Statut</span>
            <span className="text-sm font-medium text-chocolate">
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Paiement</span>
            <span className="text-sm font-medium text-chocolate">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </span>
          </div>

          <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.quantity} × {item.productName}
                </span>
                <span className="text-chocolate">
                  {formatPrice(item.lineTotal / 100)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="text-chocolate">{formatPrice(order.subtotal / 100)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Réduction</span>
                <span className="text-green-700">− {formatPrice(order.discount / 100)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="text-chocolate">
                {order.shippingCost === 0 ? "Offerte" : formatPrice(order.shippingCost / 100)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <span className="font-medium text-chocolate">Total</span>
              <span className="font-heading text-lg text-chocolate">
                {formatPrice(order.total / 100)}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6 text-sm">
            <p className="text-muted-foreground">Livraison à</p>
            <p className="mt-1 text-chocolate">{order.shippingAddressText}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-full">
            <Link href="/catalogue">Continuer mes achats</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/compte/commandes">Voir mes commandes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
