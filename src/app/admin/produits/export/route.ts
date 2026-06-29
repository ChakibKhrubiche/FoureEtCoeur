import { getCurrentUser } from "@/lib/session";
import { adminRepository } from "@/repositories/admin.repository";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    return new Response("Accès refusé", { status: 403 });
  }

  const products = await adminRepository.allProductsForExport();
  const csv = toCsv(
    ["Nom", "Slug", "Catégorie", "Prix (MAD)", "Stock", "Actif", "Badge"],
    products.map((p) => [
      p.name,
      p.slug,
      p.category.name,
      (p.price / 100).toFixed(2),
      p.stock,
      p.isActive ? "Oui" : "Non",
      p.badge ?? "",
    ]),
  );

  return csvResponse("produits-four-et-coeur.csv", csv);
}
