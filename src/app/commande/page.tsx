import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { addressRepository } from "@/repositories/address.repository";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Commande",
};

export default async function CheckoutPage() {
  const sessionUser = await getCurrentUser();

  const [dbUser, addresses] = await Promise.all([
    sessionUser
      ? prisma.user.findUnique({
          where: { id: sessionUser.id },
          select: { name: true, email: true, phone: true },
        })
      : Promise.resolve(null),
    sessionUser
      ? addressRepository.findByUser(sessionUser.id)
      : Promise.resolve([]),
  ]);

  return (
    <div className="bg-ivory pb-24 pt-28 md:pt-32">
      <div className="container-px mx-auto max-w-[80rem]">
        <h1 className="font-heading text-4xl font-light text-chocolate sm:text-5xl">
          Finaliser ma commande
        </h1>
        <div className="mt-10">
          <CheckoutForm
            user={
              dbUser
                ? {
                    name: dbUser.name ?? "",
                    email: dbUser.email,
                    phone: dbUser.phone ?? "",
                  }
                : null
            }
            addresses={addresses}
          />
        </div>
      </div>
    </div>
  );
}
