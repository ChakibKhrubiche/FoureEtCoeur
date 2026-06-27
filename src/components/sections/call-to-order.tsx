import Link from "next/link";
import { Clock, Sparkles, Truck } from "lucide-react";
import { BrandImage } from "@/components/ui/brand-image";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

const perks = [
  { icon: Sparkles, label: "Fait maison" },
  { icon: Clock, label: "Fraîcheur du jour" },
  { icon: Truck, label: "Livraison soignée" },
];

export function CallToOrder() {
  return (
    <section className="container-px mx-auto max-w-[100rem] section-py">
      <div className="relative overflow-hidden rounded-[2rem] px-6 py-24 text-center sm:px-12 md:py-32">
        {/* Fond */}
        <BrandImage
          src="/images/banners/call-to-order.jpg"
          alt=""
          fill
          sizes="100vw"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-chocolate-dark/65" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold-muted">
              Commandez en ligne
            </p>
            <h2 className="font-heading text-4xl font-light leading-tight text-ivory sm:text-6xl">
              Offrez-vous l&apos;exception,
              <br />
              dès aujourd&apos;hui
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-balance leading-relaxed text-ivory/85">
              Quelques clics suffisent pour recevoir nos créations fraîches,
              façonnées le jour même avec amour et précision.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-ivory px-10 text-chocolate hover:bg-ivory/90"
              >
                <Link href="/catalogue">Commander maintenant</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-ivory/90">
              {perks.map((perk) => (
                <li key={perk.label} className="flex items-center gap-2">
                  <perk.icon className="size-4 text-gold-muted" />
                  {perk.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
