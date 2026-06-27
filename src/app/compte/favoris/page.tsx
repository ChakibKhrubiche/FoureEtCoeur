import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { favoriteRepository } from "@/repositories/favorite.repository";
import { ProductCard } from "@/components/products/product-card";

export default async function FavoritesPage() {
  const user = await requireUser();
  const favorites = await favoriteRepository.findByUser(user.id);

  return (
    <div>
      <h2 className="font-heading text-2xl text-chocolate">Mes favoris</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Retrouvez les créations que vous avez aimées.
      </p>

      {favorites.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">
            Vous n&apos;avez pas encore de favoris.
          </p>
          <Link
            href="/catalogue"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-chocolate hover:text-gold"
          >
            Parcourir le catalogue
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
          {favorites.map((fav) => (
            <ProductCard key={fav.id} product={fav.product} isFavorite />
          ))}
        </div>
      )}
    </div>
  );
}
