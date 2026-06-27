"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { BrandImage } from "@/components/ui/brand-image";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax : l'image monte plus lentement, le contenu se fond.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden"
    >
      {/* Image de fond avec parallax */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <BrandImage
          src="/images/hero/hero-main.jpg"
          alt="Assortiment de pâtisseries artisanales Four & Cœur"
          fill
          priority
          sizes="100vw"
          className="h-full w-full"
        />
        {/* Voiles pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate-dark/30 via-chocolate-dark/20 to-chocolate-dark/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory/30 to-transparent" />
      </motion.div>

      {/* Contenu */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-px relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-ivory/90"
        >
          Pâtisserie artisanale d&apos;exception
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-light leading-[1.05] text-ivory drop-shadow-sm sm:text-7xl md:text-8xl"
        >
          Four & Cœur,
          <br />
          <span className="italic text-white text-4xl">Douceurs faites maison.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-balance text-base leading-relaxed text-ivory/90 sm:text-lg"
        >
          Chaque création est façonnée à la main, avec des ingrédients
          d&apos;exception et une exigence absolue. Une gourmandise qui se
          ressent à la première bouchée.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/catalogue">Découvrir nos créations</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-ivory/40 bg-ivory/10 px-8 text-ivory backdrop-blur-sm hover:bg-ivory/20 hover:text-ivory"
          >
            <Link href="/catalogue">Commander</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-ivory/70"
        >
          <ArrowDown className="size-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
