# Spécification technique & fonctionnelle — Four & Cœur

> E-commerce premium pour la pâtisserie artisanale **Four & Cœur** (« Douceurs faites maison »), marché **Maroc** (Casablanca), devise **MAD**.
> Document de référence vivant. Voir aussi [`PLAN.md`](./PLAN.md) (suivi par phases) et [`../CahierDeCharge.md`](../CahierDeCharge.md) (cahier des charges initial).
> Dernière mise à jour : 2026-06-29.

---

## 1. Vision & identité

- **Marque** : Four & Cœur (jeu de mots *four* = le four + *cœur*). Slogan : « Douceurs faites maison ».
- **Positionnement** : pâtisserie artisanale faite main, ingrédients d'exception, moins de sucre, qualité supérieure aux maisons traditionnelles.
- **Objectif d'expérience** : niveau « award-winning » (Awwwards), élégant, chaleureux, émotionnel, fluide (60 FPS).
- **Palette** : ivoire, crème, beige, sable, caramel, chocolat, doré discret (oklch, désaturé). Pas de couleurs saturées.
- **Typographies** : Fraunces (titres, serif chaleureux) + Geist (corps).
- **Logo** : fourni par le client, recolorisé à la palette (chocolat + cœurs dorés) via Nano Banana.

---

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 16** (App Router) + React 19 + TypeScript |
| Styles | **TailwindCSS v4** (design tokens en `@theme`) + shadcn/ui (base : Base UI) |
| Animations | **Motion** (Framer), **GSAP** + ScrollTrigger, **Lenis** (smooth scroll synchronisé au ticker GSAP) |
| Formulaires | React Hook Form + **Zod** (validation partagée client/serveur) |
| Données client | **TanStack Query**, **Zustand** (panier, persisté localStorage) |
| ORM / DB | **Prisma 6** + **PostgreSQL (Neon)** |
| Auth | **Auth.js / NextAuth v5** (Credentials + Google optionnel), JWT, RBAC |
| Images | **Gemini 2.5/3 Image (« Nano Banana »)** générées par script ; `next/image` |
| Paiement | Abstraction `PaymentProvider` — **COD** actif, Stripe/PayPal prêts à brancher |
| E-mail | Resend (Phase 6) |
| Notif commande | Service WhatsApp abstrait — `wa.me` puis API Meta (Phase 6) |
| Hébergement | Vercel |

---

## 3. Architecture & arborescence

Architecture modulaire, séparation des responsabilités :

```
src/
├─ app/                 # routes App Router (pages, layouts, route handlers)
├─ components/
│  ├─ ui/               # composants shadcn + BrandImage
│  ├─ layout/           # header, footer, logo, nav compte
│  ├─ sections/         # sections de la landing
│  ├─ products/         # carte produit, galerie, ajout panier, favori
│  ├─ catalogue/        # filtres, recherche, tri, pagination
│  ├─ cart/ checkout/   # panier & tunnel de commande
│  ├─ auth/ account/    # formulaires auth & espace client
│  └─ animations/       # Reveal, Stagger, SmoothScroll (Lenis)
├─ actions/             # Server Actions (auth, account, favorites, checkout)
├─ repositories/        # accès données typé (product, category, order, address, favorite, coupon)
├─ services/payment/    # abstraction des moyens de paiement
├─ lib/                 # prisma, auth, session, pricing, format, validations, catalogue
├─ stores/              # Zustand (cart-store)
├─ config/              # site config (nom, contact, nav, devise, ASSET_VERSION)
├─ hooks/               # use-catalogue-params
└─ types/               # types métier + augmentation next-auth
prisma/                 # schema.prisma + seed.ts
scripts/                # generate-images.ts, image-prompts.ts, recolor-logo.ts
docs/                   # PLAN.md, SPEC.md + assets du cahier des charges
```

**Flux de données** : Server Components → `repositories` (Prisma) pour la lecture ; mutations via `Server Actions` → `repositories`. Le panier vit côté client (Zustand) ; les totaux sont **recalculés et revérifiés côté serveur** à la commande (source de vérité).

---

## 4. Modèle de données (Prisma)

13 modèles. Montants en **centimes de MAD** (entiers).

- **User** (role CUSTOMER/ADMIN, passwordHash, phone, newsletterOptIn, preferences) — relations : accounts, sessions, addresses, orders, favorites, reviews, cart.
- **Account / Session / VerificationToken** — compat. Auth.js.
- **Address** (multiples par user, `isDefault`).
- **Category** (slug, position, image).
- **Product** (slug, price, compareAtPrice, images[], weightGrams, allergens[], ingredients[], stock, isActive, badge NEW/BEST_SELLER/LIMITED_EDITION, ratingAvg/ratingCount dénormalisés).
- **Favorite** (unique user+product), **Review** (1 par user/produit, rating 1-5, isApproved).
- **Cart / CartItem** (panier sauvegardé en base — branchement prévu ; le panier actif est en localStorage).
- **Order / OrderItem** : `orderNumber` (FC-AAAA-NNNN), snapshot client + adresse + produits, statut (PENDING→DELIVERED/CANCELLED), paymentMethod, paymentStatus, montants (subtotal, discount, shippingCost, taxAmount, total), `whatsappSentAt`.
- **Coupon** (PERCENTAGE/FIXED, minSubtotal, maxUses, usedCount, dates).

**Catalogue actuel** : 7 catégories (Cookies, Brownies, Gâteaux & entremets, Viennoiseries & brioches, Box & coffrets, Petit-déjeuner, Salé) et **20 produits réels** (issus des fiches Instagram du client). Photos régénérées avec Nano Banana dans le style du site.

---

## 5. Spécification fonctionnelle

### 5.1 Site public
- **Landing** : 8 sections animées (Hero parallax, Créations signature en scroll horizontal GSAP, L'art du fait-maison sticky, Best-sellers, Témoignages, Nos ingrédients layer-reveal, Call to Order, Footer). ✅
- **Header** : barre givrée, logo image, nav, icônes favoris/compte/panier (badge live). ✅
- **Témoignages** : **vrais avis clients** (WhatsApp/Instagram), sans noms (vie privée), mention « Client vérifié ». ✅
- Pages éditoriales : `/nos-creations` (par catégorie). ✅ — `/a-propos`, `/contact`, `/faq` : à créer (Phase 8).

### 5.2 Catalogue & produits ✅
- **Catalogue** `/catalogue` : filtres (catégories, prix MAD, badges), **recherche instantanée** (debounce), tri (popularité/nouveautés/prix/alpha), pagination, état vide. Tout via l'URL (partageable, SSR).
- **Fiche produit** `/produit/[slug]` : galerie + zoom, prix (+ prix barré), note/avis, badge, description, stock, allergènes/ingrédients/poids, quantité + ajout panier, favori, avis clients, produits similaires, **JSON-LD Product**.

### 5.3 Compte client ✅ (auth requise)
- Inscription / connexion (e-mail + mot de passe, Google optionnel), déconnexion.
- `/compte` : tableau de bord (compteurs + commandes récentes).
- `/compte/profil` (nom, téléphone), `/compte/adresses` (CRUD + défaut), `/compte/favoris`, `/compte/commandes` (historique).
- **Favoris persistés** en base ; cœurs pré-remplis si connecté.

### 5.4 Panier & commande ✅
- Panier (Zustand persistant) : quantités, suppression, **code promo** (validé serveur), totaux (sous-total, réduction, livraison offerte ≥ 500 MAD sinon 30 MAD, total, TVA incluse).
- Tunnel `/commande` : coordonnées (préremplies), adresse enregistrée ou nouvelle, **paiement à la livraison (COD)**, note.
- Création de commande **transactionnelle** : revérif prix/stock, **décrément stock**, numéro FC-AAAA-NNNN, incrément coupon → vidage panier → `/commande/confirmation/[numéro]`.

### 5.5 Intégrations — ⏳ Phase 6 (à faire)
- **WhatsApp** : à chaque commande, message au numéro prédéfini (n° commande, client, téléphone, adresse, produits, quantités, prix, total, date/heure, statut). Couche service abstraite (`link` wa.me → API Meta Cloud).
- **E-mail de confirmation** (Resend) : architecture + template.

### 5.6 Tableau de bord administrateur — ✅ Phase 7
- Espace `/admin` au chrome dédié (sidebar), protégé par middleware + `requireAdmin` (RBAC).
- **Dashboard** : KPIs (CA, commandes, panier moyen, clients), **graphique de CA** 30 j (Recharts), top produits, clients fidèles, commandes récentes.
- **Produits** : liste (recherche + pagination), création/édition (tous les champs), suppression, état actif.
- **Catégories** : création/édition/suppression (protégée si non vide).
- **Commandes** : liste (filtre par statut + recherche + pagination), détail, **changement de statut**.
- **Utilisateurs** : liste (recherche, rôle, nb commandes).
- **Export CSV** : produits et commandes (route handlers protégés).
> Note : l'upload d'images produit se fait par URL pour l'instant (Vercel Blob prévu ultérieurement).

### 5.7 Finition — ⏳ Phase 8
SEO complet (metadata/OG/Twitter/sitemap/robots/JSON-LD), **PWA** (manifest, service worker, installation, push, offline partiel), performance (Lighthouse > 95), accessibilité, sécurité (rate limiting, CSRF/XSS, durcissement), README, déploiement Vercel.

---

## 6. Sujets techniques transverses

- **Prix/devise** : tout en centimes MAD, formatage `Intl` `fr-MA` (`lib/format.ts`). TVA Maroc 10 % (incluse, informative) — `lib/pricing.ts`.
- **Paiement extensible** : `services/payment` — interface `PaymentProvider` + registre ; ajouter Stripe = un fichier.
- **Auth/RBAC** : split config edge-safe (`auth.config.ts`) pour le middleware ; `auth.ts` complet (Prisma + bcrypt) côté Node. Helpers `requireUser` / `requireAdmin`.
- **Images** : générées via `npm run images:generate` (modèle `gemini-3-pro-image`). Composant `BrandImage` (fallback monogramme). **Cache-busting** par `ASSET_VERSION` (`?v=N`) + `next.config` `localPatterns` — à incrémenter quand on remplace une image de même nom.
- **Animations** : helpers `Reveal`/`StaggerContainer`, `prefers-reduced-motion` respecté, Lenis synchronisé à GSAP ScrollTrigger.

---

## 7. Variables d'environnement

| Variable | Rôle | Statut |
|---|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Neon Postgres (`.env`) | ✅ |
| `AUTH_SECRET`, `AUTH_URL` | Auth.js | ✅ |
| `AUTH_GOOGLE_ID/SECRET` | Google OAuth (optionnel) | ⏳ |
| `GEMINI_API_KEY` | Génération d'images | ✅ |
| `WHATSAPP_TARGET_NUMBER`, `WHATSAPP_PROVIDER` | Notif commande | ⏳ Phase 6 |
| `RESEND_API_KEY`, `EMAIL_FROM` | E-mails | ⏳ Phase 6 |
| `BLOB_READ_WRITE_TOKEN` | Stockage images (si Vercel Blob) | ⏳ |
| `STRIPE_*` | Paiement carte | ⏳ ultérieur |
| `NEXT_PUBLIC_SITE_URL` | URL publique | ✅ |

---

## 8. Commandes

```bash
npm run dev          # développement (localhost:3000)
npm run build        # build de production
npm run start        # serveur de production
npm run db:studio    # explorer la base (Prisma Studio)
npm run db:push      # synchroniser le schéma
npm run db:seed      # (re)peupler le catalogue
npm run images:generate            # générer les images manquantes
npm run images:generate -- --force # régénérer tout
```

Compte admin de test (seed) : `admin@foure-coeur.com` / `Admin123!` (à changer en prod).
