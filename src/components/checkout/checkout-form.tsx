"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Address } from "@prisma/client";
import { useCartStore } from "@/stores/cart-store";
import { validateCouponAction, createOrderAction } from "@/actions/checkout";
import { computeTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CheckoutUser {
  name: string;
  email: string;
  phone: string;
}

export function CheckoutForm({
  user,
  addresses,
}: {
  user: CheckoutUser | null;
  addresses: Address[];
}) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const clear = useCartStore((s) => s.clear);

  const [mounted, setMounted] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adresse : "new" ou l'id d'une adresse existante.
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [addressChoice, setAddressChoice] = useState<string>(
    defaultAddr?.id ?? "new",
  );

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    if (!couponCode || subtotal === 0) return;
    validateCouponAction(couponCode, subtotal).then((r) => {
      if (r.ok && r.discount) setDiscount(r.discount);
    });
  }, [couponCode, subtotal]);

  if (mounted && items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border py-20 text-center">
        <ShoppingBag className="mx-auto size-10 text-caramel" />
        <p className="mt-6 font-heading text-2xl text-chocolate">
          Votre panier est vide
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link href="/catalogue">Voir le catalogue</Link>
        </Button>
      </div>
    );
  }

  const totals = computeTotals(subtotal, discount);
  const useExistingAddress = addressChoice !== "new";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);

    const result = await createOrderAction({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      customer: {
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
      },
      shippingAddressId: useExistingAddress ? addressChoice : null,
      shippingAddress: useExistingAddress
        ? null
        : {
            fullName: String(fd.get("fullName") ?? fd.get("name") ?? ""),
            phone: String(fd.get("addrPhone") ?? fd.get("phone") ?? ""),
            line1: String(fd.get("line1") ?? ""),
            line2: String(fd.get("line2") ?? ""),
            city: String(fd.get("city") ?? ""),
            postalCode: String(fd.get("postalCode") ?? ""),
            country: String(fd.get("country") ?? "Maroc"),
          },
      couponCode: couponCode,
      paymentMethod: "CASH_ON_DELIVERY",
      notes: String(fd.get("notes") ?? ""),
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error ?? "Une erreur est survenue.");
      toast.error(result.error ?? "Une erreur est survenue.");
      return;
    }

    clear();
    toast.success("Commande confirmée !");
    router.push(`/commande/confirmation/${result.orderNumber}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1fr_380px]">
      <div className="space-y-10">
        {/* Coordonnées */}
        <section>
          <h2 className="font-heading text-xl text-chocolate">Vos coordonnées</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" name="name" required defaultValue={user?.name ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required defaultValue={user?.email ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" required defaultValue={user?.phone ?? ""} />
            </div>
          </div>
        </section>

        {/* Livraison */}
        <section>
          <h2 className="font-heading text-xl text-chocolate">Adresse de livraison</h2>

          {addresses.length > 0 && (
            <div className="mt-4 space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 has-[:checked]:border-gold has-[:checked]:bg-secondary/50"
                >
                  <input
                    type="radio"
                    name="addressChoice"
                    value={addr.id}
                    checked={addressChoice === addr.id}
                    onChange={() => setAddressChoice(addr.id)}
                    className="mt-1 accent-chocolate"
                  />
                  <span className="text-sm text-chocolate">
                    {addr.label && <strong>{addr.label} — </strong>}
                    {addr.fullName}, {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}, {addr.postalCode}{" "}
                    {addr.city}, {addr.country} · {addr.phone}
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 has-[:checked]:border-gold has-[:checked]:bg-secondary/50">
                <input
                  type="radio"
                  name="addressChoice"
                  value="new"
                  checked={addressChoice === "new"}
                  onChange={() => setAddressChoice("new")}
                  className="accent-chocolate"
                />
                <span className="text-sm text-chocolate">Nouvelle adresse</span>
              </label>
            </div>
          )}

          {!useExistingAddress && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="fullName">Nom du destinataire</Label>
                <Input id="fullName" name="fullName" defaultValue={user?.name ?? ""} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="line1">Adresse</Label>
                <Input id="line1" name="line1" required={!useExistingAddress} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="line2">Complément (optionnel)</Label>
                <Input id="line2" name="line2" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" name="city" required={!useExistingAddress} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input id="postalCode" name="postalCode" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="addrPhone">Téléphone</Label>
                <Input id="addrPhone" name="addrPhone" type="tel" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Pays</Label>
                <Input id="country" name="country" defaultValue="Maroc" />
              </div>
            </div>
          )}
        </section>

        {/* Paiement */}
        <section>
          <h2 className="font-heading text-xl text-chocolate">Paiement</h2>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gold bg-secondary/50 p-4">
              <input type="radio" name="payment" defaultChecked className="accent-chocolate" />
              <span className="text-sm text-chocolate">
                {PAYMENT_METHOD_LABELS.CASH_ON_DELIVERY}
              </span>
            </label>
            <p className="text-xs text-muted-foreground">
              Le paiement par carte (Stripe) et PayPal seront bientôt disponibles.
            </p>
          </div>
        </section>

        {/* Notes */}
        <section>
          <h2 className="font-heading text-xl text-chocolate">
            Note (optionnel)
          </h2>
          <Textarea
            name="notes"
            placeholder="Une précision pour votre commande ?"
            className="mt-4"
          />
        </section>
      </div>

      {/* Récapitulatif */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-border bg-warm-white p-6">
          <h2 className="font-heading text-xl text-chocolate">Votre commande</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {mounted &&
              items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="text-chocolate">
                    {formatPrice((item.price * item.quantity) / 100)}
                  </span>
                </li>
              ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sous-total</dt>
              <dd className="text-chocolate">{formatPrice(totals.subtotal / 100)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Réduction</dt>
                <dd className="text-green-700">
                  − {formatPrice(totals.discount / 100)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Livraison</dt>
              <dd className="text-chocolate">
                {totals.shipping === 0 ? "Offerte" : formatPrice(totals.shipping / 100)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-base">
              <dt className="font-medium text-chocolate">Total</dt>
              <dd className="font-heading text-xl text-chocolate">
                {formatPrice(totals.total / 100)}
              </dd>
            </div>
          </dl>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={submitting || !mounted}
            className="mt-6 w-full rounded-full"
          >
            {submitting ? "Validation…" : "Confirmer la commande"}
          </Button>
        </div>
      </aside>
    </form>
  );
}
