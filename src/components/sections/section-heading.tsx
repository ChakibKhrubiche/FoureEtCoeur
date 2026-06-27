import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";

/** En-tête de section éditorial (suréitre + titre + intro). */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-caramel">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-4xl font-light leading-tight text-chocolate sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
