import { getCurrentUser } from "@/lib/session";
import { adminRepository } from "@/repositories/admin.repository";
import { toCsv, csvResponse } from "@/lib/csv";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types/order";

export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    return new Response("Accès refusé", { status: 403 });
  }

  const orders = await adminRepository.allOrdersForExport();
  const csv = toCsv(
    ["N° commande", "Date", "Client", "E-mail", "Téléphone", "Statut", "Paiement", "Total (MAD)"],
    orders.map((o) => [
      o.orderNumber,
      o.createdAt.toISOString().slice(0, 16).replace("T", " "),
      o.customerName,
      o.customerEmail,
      o.customerPhone,
      ORDER_STATUS_LABELS[o.status],
      PAYMENT_METHOD_LABELS[o.paymentMethod],
      (o.total / 100).toFixed(2),
    ]),
  );

  return csvResponse("commandes-four-et-coeur.csv", csv);
}
