import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ASSET_VERSION } from "@/config/site";

/**
 * Logotype Four & Cœur (image recolorisée à la palette du site).
 * `mix-blend-multiply` fond le fond ivoire de l'image sur les surfaces claires.
 */
export function Logo({
  className,
  size = 56,
  href = "/",
  priority = false,
}: {
  className?: string;
  size?: number;
  href?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="Four & Cœur — accueil"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={`/images/brand/logo.jpg?v=${ASSET_VERSION}`}
        alt="Four & Cœur — Douceurs faites maison"
        width={size}
        height={size}
        priority={priority}
        className="h-auto w-auto mix-blend-multiply"
        style={{ height: size }}
      />
    </Link>
  );
}
