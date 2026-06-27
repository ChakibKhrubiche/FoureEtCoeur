"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { validateCouponAction } from "@/actions/checkout";
import { computeTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { BrandImage } from "@/components/ui/brand-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setCoupon = useCartStore((s) => s.setCoupon);

  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState(couponCode ?? "");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Re-valide un coupon déjà appliqué au montage / quand le panier change.
  useEffect(() => {
    if (!couponCode || subtotal === 0) {
      setDiscount(0);
      return;
    }
    validateCouponAction(couponCode, subtotal).then((r) => {
      if (r.ok && r.discount) setDiscount(r.discount);
      else {
        setDiscount(0);
        setCoupon(null);
      }
    });
  }, [couponCode, subtotal, setCoupon]);

  async function applyCoupon() {
    if (!code.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    const r = await validateCouponAction(code, subtotal);
    setApplying(false);
    if (r.ok && r.discount) {
      setCoupon(code.trim().toUpperCase());
      setDiscount(r.discount);
      toast.success("Code promo appliqué");
    } else {
      setCouponMsg(r.message ?? "Code invalide");
      setDiscount(0);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCode("");
    setDiscount(0);
    setCouponMsg(null);
  }

  if (!mounted) {
    return <div className="h-64" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border py-20 text-center">
        <ShoppingBag className="mx-auto size-10 text-caramel" />
        <p className="mt-6 font-heading text-2xl text-chocolate">
          Votre panier est vide
        </p>
        <p className="mt-2 text-muted-foreground">
          Laissez-vous tenter par nos créations.
        </p>
        <Button asChild className="mt-8 rounded-full">
          <Link href="/catalogue">Découvrir le catalogue</Link>
        </Button>
      </div>
    );
  }

  const totals = computeTotals(subtotal, discount);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
      {/* Articles */}
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-5 py-6 first:pt-0">
            <Link
              href={`/produit/${item.slug}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-2xl"
            >
              <BrandImage
                src={item.image}
                alt={item.name}
                fill
                sizes="96px"
                className="h-full w-full"
              />
            </Link>

            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <Link
                  href={`/produit/${item.slug}`}
                  className="font-heading text-lg text-chocolate hover:text-gold"
                >
                  {item.name}
                </Link>
                <span className="font-medium text-chocolate">
                  {formatPrice((item.price * item.quantity) / 100)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.price / 100)} l&apos;unité
              </p>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Diminuer"
                    className="flex size-9 items-center justify-center rounded-full text-chocolate hover:bg-secondary"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    aria-label="Augmenter"
                    className="flex size-9 items-center justify-center rounded-full text-chocolate hover:bg-secondary disabled:opacity-40"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                  Retirer
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Récapitulatif */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-border bg-warm-white p-6">
          <h2 className="font-heading text-xl text-chocolate">Récapitulatif</h2>

          {/* Code promo */}
          <div className="mt-5">
            {discount > 0 ? (
              <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm">
                <span className="flex items-center gap-2 text-chocolate">
                  <Tag className="size-4" />
                  {couponCode}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code promo"
                  className="bg-background"
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                <Button
                  variant="outline"
                  onClick={applyCoupon}
                  disabled={applying}
                  className="shrink-0"
                >
                  Appliquer
                </Button>
              </div>
            )}
            {couponMsg && (
              <p className="mt-2 text-sm text-destructive">{couponMsg}</p>
            )}
          </div>

          {/* Totaux */}
          <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
            <Row label="Sous-total" value={formatPrice(totals.subtotal / 100)} />
            {totals.discount > 0 && (
              <Row
                label="Réduction"
                value={`− ${formatPrice(totals.discount / 100)}`}
                accent
              />
            )}
            <Row
              label="Livraison"
              value={
                totals.shipping === 0
                  ? "Offerte"
                  : formatPrice(totals.shipping / 100)
              }
            />
            <div className="flex items-center justify-between border-t border-border pt-4 text-base">
              <dt className="font-medium text-chocolate">Total</dt>
              <dd className="font-heading text-xl text-chocolate">
                {formatPrice(totals.total / 100)}
              </dd>
            </div>
            <p className="text-xs text-muted-foreground">
              Dont TVA : {formatPrice(totals.vatIncluded / 100)}
            </p>
          </dl>

          <Button asChild size="lg" className="mt-6 w-full rounded-full">
            <Link href="/commande">
              Passer la commande
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "text-green-700" : "text-chocolate"}>{value}</dd>
    </div>
  );
}
