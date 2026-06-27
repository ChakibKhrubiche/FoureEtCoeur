import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Mon panier",
};

export default function CartPage() {
  return (
    <div className="bg-ivory pb-24 pt-28 md:pt-32">
      <div className="container-px mx-auto max-w-[80rem]">
        <h1 className="font-heading text-4xl font-light text-chocolate sm:text-5xl">
          Mon panier
        </h1>
        <div className="mt-10">
          <CartView />
        </div>
      </div>
    </div>
  );
}
