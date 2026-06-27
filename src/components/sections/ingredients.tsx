"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { BrandImage } from "@/components/ui/brand-image";
import { Reveal } from "@/components/animations/reveal";

const pillars = [
  { title: "Beurre AOP", text: "Pour des feuilletages d'une finesse incomparable." },
  { title: "Moins de sucre, plus d'émotion", text: "Des créations pensées pour laisser s'exprimer pleinement le beurre, le chocolat, les fruits et les épices, sans excès de sucre." },
  { title: "Chocolats grands crus", text: "Sélectionnés pour leur intensité et leur rondeur." },
  { title: "Fruits de saison", text: "Choisis chaque matin, au sommet de leur maturité." },
];

export function Ingredients() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "10%"]);

  return (
    <section ref={ref} className="overflow-hidden bg-cream section-py">
      <div className="container-px mx-auto max-w-[100rem]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visuels en couches */}
          <div className="relative h-[60vh] lg:h-[80vh]">
            <motion.div
              style={{ y: y1 }}
              className="absolute left-0 top-0 h-[70%] w-[75%] overflow-hidden rounded-3xl"
            >
              <BrandImage
                src="/images/sections/ingredients.jpg"
                alt="Ingrédients premium pour la pâtisserie"
                fill
                sizes="(max-width: 1024px) 75vw, 38vw"
                className="h-full w-full"
              />
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              className="absolute bottom-0 right-0 h-[55%] w-[55%] overflow-hidden rounded-3xl border-8 border-cream shadow-xl"
            >
              <BrandImage
                src="/images/sections/atelier.jpg"
                alt="Atelier de pâtisserie"
                fill
                sizes="(max-width: 1024px) 55vw, 28vw"
                className="h-full w-full"
              />
            </motion.div>
          </div>

          {/* Texte */}
          <div>
            <Reveal>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-caramel">
                Nos ingrédients
              </p>
              <h2 className="font-heading text-4xl font-light leading-tight text-chocolate sm:text-5xl">
                La qualité ne se négocie pas
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Nous sélectionnons chaque ingrédient avec une exigence
                d&apos;artisan. Parce qu&apos;une grande pâtisserie commence
                toujours par de grands produits.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <h3 className="font-heading text-xl text-chocolate">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
