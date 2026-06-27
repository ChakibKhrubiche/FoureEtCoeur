"use client";

import { motion, useReducedMotion } from "motion/react";
import { Star, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";

/**
 * Vrais retours clients (messages WhatsApp / Instagram), transcrits fidèlement
 * et légèrement remis en forme. Aucun nom n'est affiché par respect de la vie privée.
 */
const testimonials = [
  {
    quote:
      "Les cookies devaient rester pour le goûter de la semaine… mais c'était tellement alléchant, en visuel comme en goût, qu'il n'en est resté que la moitié 😍",
    context: "Commande de cookies",
  },
  {
    quote:
      "Le gâteau était trop trop bon, et surtout très frais. Vous m'avez fait honneur devant mes invités, ils ont adoré. Merci pour votre service top top top, à très bientôt 🥰",
    context: "Gâteau pour invités",
  },
  {
    quote:
      "C'était hyper bon, tout le monde a adoré. Tbarkellah 3lik ❤️ Je veux déjà recommander un plateau de 12 cookies !",
    context: "Plateau de cookies",
  },
  {
    quote:
      "Hellooo ma belle 🥰 c'était très très bon, wllah makmlch lina nhar ! Je serai une de tes clientes fidèles.",
    context: "Cliente fidèle",
  },
  {
    quote:
      "Un pur plaisir 😍 Il manque des pièces sur la photo : je n'ai pas réussi à les arracher des enfants avant de la prendre 😅",
    context: "Plateau salé",
  },
  {
    quote: "Mille mercis pour ces douceurs succulentes 🤍",
    context: "Box de douceurs",
  },
  {
    quote:
      "J'ai goûté la basboussa cheesecake, elle est trop trop bonne et pas trop sucrée. Mes invités ont adoré. Bravo et bonne continuation 🙏",
    context: "Basboussa cheesecake",
  },
  {
    quote:
      "C'était excellent et succulent, tbarkalah 3lik 😋 merci beaucoup… ils ont disparu très rapidement 😂",
    context: "Commande gourmande",
  },
  {
    quote:
      "Le box goûter est top ! Je serai tranquille toute la semaine pour le petit-déj et le goûter des enfants. J'ai juste peur qu'il n'en reste plus, ils ont adoré 😅",
    context: "Box goûter scolaire",
  },
];

export function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-secondary section-py">
      <div className="container-px mx-auto max-w-[100rem]">
        <SectionHeading
          eyebrow="Ils nous font confiance"
          title="Vos retours, notre plus belle récompense"
          description="De vrais messages reçus de nos clients après leurs commandes."
        />

        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: (i % 3) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="break-inside-avoid rounded-3xl bg-ivory p-8 shadow-[0_8px_40px_-12px_rgba(60,40,30,0.12)]"
            >
              <div className="mb-4 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-4 fill-gold" />
                ))}
              </div>
              <blockquote className="font-heading text-lg font-light leading-relaxed text-chocolate">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-2 text-sm">
                <BadgeCheck className="size-4 text-gold" />
                <span className="text-muted-foreground">
                  {t.context} · Client vérifié
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
