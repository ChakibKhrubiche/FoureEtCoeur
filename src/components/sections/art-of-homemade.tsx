import { BrandImage } from "@/components/ui/brand-image";
import { Reveal } from "@/components/animations/reveal";

const steps = [
  {
    n: "01",
    title: "Des ingrédients d'exception",
    text: "Beurre AOP, vanille de Madagascar, chocolats de grands crus, fruits de saison sélectionnés chaque matin. La qualité commence à la source.",
  },
  {
    n: "02",
    title: "Le geste, encore et toujours",
    text: "Feuilletages tournés à la main, ganaches montées avec patience, cuissons surveillées à la minute. Aucun raccourci, jamais.",
  },
  {
    n: "03",
    title: "L'obsession du détail",
    text: "Chaque création est dressée comme un bijou. Ce qui se voit autant que ce qui se goûte : voilà notre signature.",
  },
  {
    n: "04",
    title: "La passion comme moteur",
    text: "Derrière chaque pâtisserie, une équipe qui aime profondément son métier et le partage avec vous.",
  },
];

export function ArtOfHomemade() {
  return (
    <section className="bg-warm-white section-py">
      <div className="container-px mx-auto max-w-[100rem]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image sticky */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="relative h-[60vh] overflow-hidden rounded-3xl lg:h-full">
              <BrandImage
                src="/images/sections/art-of-homemade.jpg"
                alt="Le geste artisanal du pâtissier"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Étapes */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-caramel">
                L&apos;art du fait maison
              </p>
              <h2 className="font-heading text-4xl font-light leading-tight text-chocolate sm:text-5xl">
                Une histoire de mains,
                <br />
                de temps et de passion
              </h2>
            </Reveal>

            <div className="mt-12 space-y-12">
              {steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.05}>
                  <div className="flex gap-6 border-t border-border pt-8">
                    <span className="font-heading text-2xl text-gold">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl text-chocolate">
                        {step.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
