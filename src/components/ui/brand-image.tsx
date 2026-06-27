"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ASSET_VERSION } from "@/config/site";

/** Ajoute un paramètre de version aux sources d'images locales (cache-busting). */
function withVersion(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src !== "string" || !src) return src;
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return `${src}${src.includes("?") ? "&" : "?"}v=${ASSET_VERSION}`;
}

/**
 * Image de marque avec placeholder élégant.
 * Tant que le visuel n'est pas disponible (ou en cas d'erreur de chargement),
 * affiche un dégradé chaleureux + un monogramme discret au lieu d'une image cassée.
 *
 * - `className` : appliqué au conteneur (span).
 * - `imageClassName` + `style` : appliqués à l'image (utile pour zoom/scale).
 */
export function BrandImage({
  className,
  imageClassName,
  alt,
  src,
  style,
  ...props
}: ImageProps & { className?: string; imageClassName?: string }) {
  const [failed, setFailed] = useState(false);
  const missing = !src || src === "";

  return (
    <span
      className={cn(
        "relative block overflow-hidden bg-gradient-to-br from-cream via-beige to-sand",
        className,
      )}
    >
      {!failed && !missing && (
        <Image
          alt={alt}
          src={withVersion(src)}
          style={style}
          {...props}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      )}
      {(failed || missing) && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-2xl tracking-tight text-chocolate/30 select-none">
            F<span className="text-gold/50">&</span>C
          </span>
        </span>
      )}
    </span>
  );
}
