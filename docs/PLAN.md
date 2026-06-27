# Plan d'exécution — Foure & Coeur

> E-commerce premium pour une pâtisserie artisanale (marché **Maroc**, devise **MAD**).
> Spécification complète : [`../CahierDeCharge.md`](../CahierDeCharge.md).
> Ce document est la **référence de suivi** : il est mis à jour à chaque phase.

Dernière mise à jour : 2026-06-26.

---

## Décisions techniques (verrouillées)

| Sujet | Choix | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) + React 19 + TS | Tailwind v4, src/ dir |
| UI | shadcn/ui + Tailwind v4 (tokens marque) | Fraunces (titres) + Geist (corps) |
| Animations | Motion (Framer) + GSAP + ScrollTrigger + Lenis | objectif 60 FPS |
| Base de données | **Neon** (Postgres serverless) + **Prisma 6** | `.env` (lu par Prisma + Next) |
| Auth | **Auth.js / NextAuth v5** | RBAC (CUSTOMER / ADMIN) |
| Images | **Gemini 2.5 Flash Image** ("Nano Banana") | clé fournie ; script lancé par l'utilisateur |
| Paiement | **COD** d'abord, abstraction `PaymentProvider` | Stripe/PayPal plus tard |
| WhatsApp | **wa.me** d'abord, couche service abstraite | API Meta Cloud plus tard |
| Stockage images | Vercel Blob (ou Cloudinary) | à confirmer Phase 3 |
| E-mails | Resend | Phase 6 |
| Hébergement | Vercel | Phase 8 |

Devise : **MAD**, locale `fr-MA`. Prix stockés en **centimes** (entiers).
Nom de marque officiel : **Four & Cœur** — « Douceurs faites maison » (logo fourni, recolorisé à la palette). Catalogue = 20 vrais produits Instagram (7 catégories). WhatsApp commandes : 0633774886.

> ⚠️ Prix estimés à confirmer (placeholders « 999 » dans le fichier source) : Gâteau chocolat praliné 250, Brownies ultra gourmands 160, Gâteau cœur citron 130, Konafa 180, Madeleines 90, Box goûter scolaire 180, Mini cannelés 80, Plateau salé 48 → 350 MAD.

---

## État d'avancement

- [x] **Phase 0 — Fondations**
- [x] **Phase 1 — Base de données**
- [x] **Phase 2 — Landing page premium** (✅ 27 visuels Nano Banana 2 ; reste : revue visuelle)
- [x] **Phase 3 — Catalogue & fiches produits** (reste : stockage images Vercel Blob, avis connectés en Phase 4)
- [x] **Phase 4 — Auth & espace client** (favoris persistés ; avis en écriture à brancher plus tard)
- [x] **Phase 5 — Panier & commande** (COD ; WhatsApp + e-mail branchés en Phase 6)
- [ ] **Phase 6 — Intégrations (WhatsApp, e-mails, stock)**
- [ ] **Phase 7 — Dashboard admin**
- [ ] **Phase 8 — Finition (SEO, PWA, perf, sécurité, déploiement)**

---

## Phase 0 — Fondations ✅

- Scaffold Next.js 16 + Tailwind v4 + shadcn/ui.
- Dépendances : motion, gsap, lenis, react-hook-form, zod, @tanstack/react-query, zustand, prisma, next-auth, recharts, resend, sonner, bcryptjs, tsx, @google/genai.
- **Design tokens** de marque (oklch) : ivory, cream, beige, sand, caramel, chocolate, gold → classes utilitaires.
- Typographies : Fraunces (titres) + Geist (corps).
- Structure modulaire : `components`, `features`, `hooks`, `services`, `lib`, `repositories`, `actions`, `types`, `config`, `stores`.
- Providers (TanStack Query, Lenis smooth scroll, Toaster).
- `.env` / `.env.local` / `.env.example` + `.gitignore` durci (clés jamais commitées).
- Build de production validé.

## Phase 1 — Base de données ✅

- Schéma Prisma : 13 modèles + enums + index (compatible Auth.js).
- Tables créées dans Neon (`prisma db push`).
- Seed : 6 catégories, 12 produits (prix en centimes MAD), 2 coupons, 1 admin.
  - Admin de test : `admin@foure-coeur.com` / `Admin123!` (à changer en prod).
- Singleton Prisma (`src/lib/prisma.ts`).
- Repositories : `category.repository.ts`, `product.repository.ts`.
- Scripts npm : `db:generate`, `db:push`, `db:migrate`, `db:seed`, `db:studio`.

## Phase 2 — Landing page premium (en cours)

1. **Script de génération d'images** (`scripts/generate-images.ts`) + tous les prompts Nano Banana
   (pâtisseries, catégories, hero, lifestyle, bannières, fonds). Lancé par l'utilisateur via `npm run images:generate`.
2. **Header** (nav élégante, transparent → solide au scroll, menu mobile) + **Footer** premium (newsletter, réseaux, navigation, contact).
3. Les **8 sections** (chacune avec une identité visuelle et une animation distinctes) :
   1. Hero Experience — hero épinglé, parallax, fade layers.
   2. Signature Creations — scroll horizontal épinglé, grandes cartes éditoriales.
   3. The Art of Homemade — sticky storytelling.
   4. Best Sellers — vitrine interactive, hover, cartes 3D.
   5. Testimonials — cartes flottantes, transitions douces.
   6. Our Ingredients — layer reveal, textures naturelles.
   7. Call to Order — CTA animé.
   8. Premium Footer.
4. Helpers d'animation réutilisables (fade/stagger/parallax, reduced-motion).
5. Composant image avec **placeholder de marque** (fallback tant que les visuels Gemini ne sont pas générés).
6. Captures à 1440px par section + raffinement (spacing, typo, proportions).

## Phase 3 — Catalogue & fiches produits

- Page catalogue : filtres (catégories, prix, popularité, nouveautés, favoris), recherche instantanée, tri, pagination.
- Fiche produit : galerie + zoom, description, allergènes/ingrédients, avis, produits similaires, favoris, ajout panier, quantité.
- Stockage images : intégration Vercel Blob (ou Cloudinary).
- API/Server Actions de lecture catalogue + hooks TanStack Query.

## Phase 4 — Auth & espace client

- Auth.js v5 (credentials + option Google), adaptateur Prisma, RBAC, middleware.
- Pages : connexion, inscription.
- Espace client : profil, adresses (multiples), favoris, historique commandes, préférences/notifications.

## Phase 5 — Panier & commande

- Store panier (Zustand) + persistance (panier sauvegardé en base si connecté).
- Ajouter / supprimer / modifier quantité, code promo, calculs (sous-total, TVA, livraison, total).
- Tunnel de commande, abstraction `PaymentProvider` (COD fonctionnel).
- Page confirmation de commande.

## Phase 6 — Intégrations

- Service WhatsApp abstrait (provider `link` wa.me, prêt pour `meta`).
- Création commande → décrément stock (transaction) → historique → notification WhatsApp.
- E-mails transactionnels (Resend) — architecture + template de confirmation.

## Phase 7 — Dashboard admin

- Connexion admin (RBAC), layout dédié.
- CRUD produits / catégories ; gestion commandes (changement de statut) ; gestion utilisateurs.
- Statistiques : CA, ventes, produits les plus vendus, clients fidèles, panier moyen (architecture visiteurs).
- Graphiques (Recharts), export CSV, recherche, filtres, pagination.

## Phase 8 — Finition

- SEO : metadata, OpenGraph, Twitter Cards, JSON-LD/Schema.org, sitemap, robots.txt.
- PWA : manifest, service worker, installation mobile, notifications push, offline partiel.
- Performance : Server Components, optimisation images, code splitting, lazy loading, Suspense/streaming (Lighthouse > 95).
- Accessibilité (> 95), sécurité (Zod, CSRF, XSS, rate limiting, middleware, RBAC).
- README détaillé, configuration Vercel, déploiement.

---

## Services & clés (récapitulatif)

| Service | Variable(s) | Statut |
|---|---|---|
| Neon (Postgres) | `DATABASE_URL`, `DIRECT_URL` | ✅ fourni |
| Gemini (images) | `GEMINI_API_KEY` | ✅ OK — facturation activée, modèle `gemini-3-pro-image` (Nano Banana 2), 27 visuels générés |
| Auth.js | `AUTH_SECRET` (+ Google OAuth optionnel) | ✅ configuré (secret généré) |
| Vercel Blob | `BLOB_READ_WRITE_TOKEN` | ⏳ Phase 3 |
| Resend | `RESEND_API_KEY`, `EMAIL_FROM` | ⏳ Phase 6 |
| WhatsApp | `WHATSAPP_TARGET_NUMBER` (+ Meta plus tard) | ⏳ Phase 6 |
| Stripe | clés Stripe | ⏳ ultérieur |
