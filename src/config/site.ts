/**
 * Configuration globale de la marque Four & Cœur.
 * Source unique de vérité pour le nom, les métadonnées, la navigation et les liens.
 */

export const siteConfig = {
  name: "Four & Cœur",
  tagline: "Douceurs faites maison",
  description:
    "Four & Cœur — douceurs artisanales faites maison avec des ingrédients d'exception. Cookies, brownies, gâteaux, viennoiseries, box gourmandes et plateaux, faits main à Casablanca.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_MA",
  // Locale BCP-47 pour le formatage (Intl)
  formatLocale: "fr-MA",
  currency: "MAD",
  // TVA applicable (Maroc) — à ajuster selon produit/réglementation
  vatRate: 0.1,
  contact: {
    email: "contact@fouretcoeur.ma",
    phone: "+212 6 33 77 48 86",
    address: "Casablanca, Maroc",
  },
  social: {
    instagram: "https://www.instagram.com/four.et.coeur/",
    facebook: "https://web.facebook.com/profile.php?id=61581025010907#",
    pinterest: "https://pinterest.com/foure.coeur",
  },
} as const;

/** Navigation principale (header). */
export const mainNav = [
  { title: "Accueil", href: "/" },
  { title: "Catalogue", href: "/catalogue" },
  { title: "Nos créations", href: "/nos-creations" },
  { title: "À propos", href: "/a-propos" },
  { title: "Contact", href: "/contact" },
] as const;

/** Navigation du pied de page. */
export const footerNav = {
  boutique: [
    { title: "Catalogue", href: "/catalogue" },
    { title: "Nos créations", href: "/nos-creations" },
    { title: "Best-sellers", href: "/catalogue?tri=plus-vendus" },
    { title: "Nouveautés", href: "/catalogue?tri=plus-recents" },
  ],
  maison: [
    { title: "À propos", href: "/a-propos" },
    { title: "Contact", href: "/contact" },
    { title: "FAQ", href: "/faq" },
  ],
  legal: [
    { title: "Politique de confidentialité", href: "/confidentialite" },
    { title: "Conditions générales", href: "/cgv" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Version des assets images. À incrémenter quand on remplace des images
 * portant le même nom de fichier, pour forcer le navigateur à recharger
 * (contourne le cache des images optimisées Next).
 */
export const ASSET_VERSION = "3";
