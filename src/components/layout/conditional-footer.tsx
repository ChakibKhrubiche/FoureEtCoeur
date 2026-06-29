"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

/** Masque le footer public dans l'espace admin (qui a son propre chrome). */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Footer />;
}
