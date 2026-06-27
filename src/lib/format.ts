import { siteConfig } from "@/config/site";

/** Formate un montant en Dirham marocain (MAD) selon la locale fr-MA : 120,00 MAD. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(siteConfig.formatLocale, {
    style: "currency",
    currency: siteConfig.currency,
  }).format(amount);
}

/** Formate une date en français long : 26 juin 2026. */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(siteConfig.formatLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
