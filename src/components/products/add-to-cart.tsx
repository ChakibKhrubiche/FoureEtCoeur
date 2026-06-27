"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface AddToCartProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  className?: string;
}

export function AddToCart({ product, className }: AddToCartProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: product.stock,
      },
      quantity,
    );
    toast.success(`${product.name} ajouté au panier`, {
      description: `Quantité : ${quantity}`,
    });
  }

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
      {/* Sélecteur de quantité */}
      <div className="flex items-center rounded-full border border-border">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1 || outOfStock}
          aria-label="Diminuer la quantité"
          className="flex size-11 items-center justify-center rounded-full text-chocolate transition-colors hover:bg-secondary disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center font-medium tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={quantity >= product.stock || outOfStock}
          aria-label="Augmenter la quantité"
          className="flex size-11 items-center justify-center rounded-full text-chocolate transition-colors hover:bg-secondary disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <Button
        size="lg"
        onClick={handleAdd}
        disabled={outOfStock}
        className="flex-1 rounded-full"
      >
        <ShoppingBag className="size-4" />
        {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
      </Button>
    </div>
  );
}
