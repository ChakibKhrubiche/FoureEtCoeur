"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/actions/admin";
import { ORDER_STATUS_LABELS } from "@/types/order";

/** Sélecteur de statut de commande (met à jour immédiatement). */
export function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value as OrderStatus;
        startTransition(async () => {
          await updateOrderStatusAction(orderId, status);
          toast.success("Statut mis à jour");
        });
      }}
      className="h-10 rounded-full border border-border bg-ivory px-4 text-sm text-chocolate outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 disabled:opacity-60"
    >
      {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
