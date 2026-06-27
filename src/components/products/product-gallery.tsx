"use client";

import { useRef, useState } from "react";
import { BrandImage } from "@/components/ui/brand-image";
import { cn } from "@/lib/utils";

/** Galerie produit : image principale avec zoom au survol + miniatures. */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const gallery = images.length ? images : [""];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={ref}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-secondary"
      >
        <BrandImage
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-full w-full"
          imageClassName={cn(
            "transition-transform duration-300 ease-out",
            zoom ? "scale-[1.8]" : "scale-100",
          )}
          style={{ transformOrigin: origin }}
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir l'image ${i + 1}`}
              className={cn(
                "relative size-20 overflow-hidden rounded-xl border-2 transition-colors",
                i === active ? "border-gold" : "border-transparent",
              )}
            >
              <BrandImage
                src={img}
                alt={`${alt} — vue ${i + 1}`}
                fill
                sizes="80px"
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
