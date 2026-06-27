import { Star, Trash2 } from "lucide-react";
import { requireUser } from "@/lib/session";
import { addressRepository } from "@/repositories/address.repository";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/actions/account";
import { Badge } from "@/components/ui/badge";
import { AddAddressForm } from "@/components/account/add-address-form";

export default async function AddressesPage() {
  const user = await requireUser();
  const addresses = await addressRepository.findByUser(user.id);

  return (
    <div>
      <h2 className="font-heading text-2xl text-chocolate">Mes adresses</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Gérez vos adresses de livraison.
      </p>

      {addresses.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <article
              key={addr.id}
              className="relative rounded-2xl border border-border bg-warm-white p-6"
            >
              <div className="flex items-center gap-2">
                {addr.label && (
                  <span className="font-medium text-chocolate">{addr.label}</span>
                )}
                {addr.isDefault && (
                  <Badge className="rounded-full text-xs">Par défaut</Badge>
                )}
              </div>
              <address className="mt-2 text-sm not-italic leading-relaxed text-muted-foreground">
                {addr.fullName}
                <br />
                {addr.line1}
                {addr.line2 && (
                  <>
                    <br />
                    {addr.line2}
                  </>
                )}
                <br />
                {addr.postalCode} {addr.city}, {addr.country}
                <br />
                {addr.phone}
              </address>

              <div className="mt-4 flex gap-2">
                {!addr.isDefault && (
                  <form action={setDefaultAddressAction.bind(null, addr.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-chocolate"
                    >
                      <Star className="size-3.5" />
                      Définir par défaut
                    </button>
                  </form>
                )}
                <form action={deleteAddressAction.bind(null, addr.id)}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Supprimer
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8">
        <AddAddressForm />
      </div>
    </div>
  );
}
