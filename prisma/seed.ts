import { PrismaClient, ProductBadge, DiscountType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Prix exprimés en centimes de MAD (ex: 13900 = 139,00 MAD). */

const categories = [
  {
    name: "Cookies",
    slug: "cookies",
    description: "Cookies garnis, fondants au cœur, faits maison.",
    image: "/images/products/box-12-mini-cookies-garnis.jpg",
    position: 1,
  },
  {
    name: "Brownies",
    slug: "brownies",
    description: "Brownies fondants au chocolat intense, ultra gourmands.",
    image: "/images/products/brownies-ultra-gourmands.jpg",
    position: 2,
  },
  {
    name: "Gâteaux & entremets",
    slug: "gateaux",
    description: "Gâteaux signature et entremets pour vos grands moments.",
    image: "/images/products/gateau-chocolat-praline.jpg",
    position: 3,
  },
  {
    name: "Viennoiseries & brioches",
    slug: "viennoiseries",
    description: "Brioches, madeleines, cannelés et douceurs du goûter.",
    image: "/images/products/tressee-fondante.jpg",
    position: 4,
  },
  {
    name: "Box & coffrets",
    slug: "box-coffrets",
    description: "Des box gourmandes à partager ou à offrir.",
    image: "/images/products/box-gouter-scolaire.jpg",
    position: 5,
  },
  {
    name: "Petit-déjeuner",
    slug: "petit-dejeuner",
    description: "Granola et douceurs saines pour bien commencer la journée.",
    image: "/images/products/granola-maison.jpg",
    position: 6,
  },
  {
    name: "Salé",
    slug: "sale",
    description: "Plateaux salés faits maison, parfaits pour vos événements.",
    image: "/images/products/plateau-sale.jpg",
    position: 7,
  },
] as const;

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  price: number;
  /** true si le prix est une estimation à confirmer par le client. */
  estimatedPrice?: boolean;
  categorySlug: string;
  images: string[];
  weightGrams?: number;
  allergens: string[];
  ingredients: string[];
  stock: number;
  badge?: ProductBadge;
  ratingAvg: number;
  ratingCount: number;
};

const products: ProductSeed[] = [
  // ---------------- COOKIES ----------------
  {
    name: "Cookie Choco Caramel",
    slug: "cookie-choco-caramel",
    description:
      "Notre cookie signature. Une pâte moelleuse au vrai beurre, généreusement garnie de caramel au beurre salé maison et d'une ganache au chocolat noir préparée sur place. Le goût de l'essentiel, du vrai, du fait maison.",
    price: 1900,
    categorySlug: "cookies",
    images: ["/images/products/cookie-choco-caramel.jpg"],
    weightGrams: 90,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Farine", "Beurre", "Œufs", "Caramel beurre salé maison", "Chocolat noir", "Sucre"],
    stock: 120,
    badge: ProductBadge.BEST_SELLER,
    ratingAvg: 5.0,
    ratingCount: 64,
  },
  {
    name: "Box de 12 mini cookies garnis",
    slug: "box-12-mini-cookies-garnis",
    description:
      "Les cookies garnis signés Four & Cœur reviennent en force. Au menu : Red Velvet, Spéculoos, Chocolat, Pistache et New-Yorkais. Parfaits pour une pause plaisir bien méritée.",
    price: 13900,
    categorySlug: "cookies",
    images: ["/images/products/box-12-mini-cookies-garnis.jpg"],
    weightGrams: 360,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Farine", "Beurre", "Chocolat", "Pistache", "Spéculoos", "Sucre"],
    stock: 40,
    badge: ProductBadge.BEST_SELLER,
    ratingAvg: 4.9,
    ratingCount: 87,
  },
  {
    name: "Cookie géant fourré",
    slug: "cookie-geant-fourre",
    description:
      "C'est doré, c'est crousti-fondant, et ça sort tout juste du four. Il fond, il craque, il rend accro. Fait maison avec amour.",
    price: 14500,
    categorySlug: "cookies",
    images: ["/images/products/cookie-geant-fourre.jpg"],
    weightGrams: 220,
    allergens: ["Gluten", "Lait", "Œufs"],
    ingredients: ["Farine", "Beurre", "Chocolat fondant", "Cassonade", "Œufs"],
    stock: 30,
    ratingAvg: 4.9,
    ratingCount: 41,
  },
  {
    name: "Sachet de 12 mini cookies",
    slug: "box-12-mini-cookies",
    description:
      "Le format goûter pour les petits cœurs. Des cookies moins sucrés, toujours moelleux et faits maison, dans un sachet pratique de 12 pièces : pépites de chocolat blanc et noir, noix et cacahuètes. Idéal pour la boîte à goûter.",
    price: 10000,
    categorySlug: "cookies",
    images: ["/images/products/box-12-mini-cookies.jpg"],
    weightGrams: 300,
    allergens: ["Gluten", "Lait", "Œufs", "Arachides", "Fruits à coque"],
    ingredients: ["Farine", "Beurre", "Chocolat blanc", "Chocolat noir", "Noix", "Cacahuètes"],
    stock: 50,
    badge: ProductBadge.NEW,
    ratingAvg: 4.8,
    ratingCount: 33,
  },

  // ---------------- BROWNIES ----------------
  {
    name: "Brownies ultra gourmands",
    slug: "brownies-ultra-gourmands",
    description:
      "Nos brownies ultra gourmands, généreusement garnis de crème noisette, pistache kunafa, spéculoos croustillant et chocolat intense. Fraîchement faits maison, sans industriel — juste du pur plaisir.",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "brownies",
    images: ["/images/products/brownies-ultra-gourmands.jpg"],
    weightGrams: 600,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque", "Soja"],
    ingredients: ["Chocolat", "Beurre", "Œufs", "Crème noisette", "Pistache", "Spéculoos"],
    stock: 24,
    badge: ProductBadge.BEST_SELLER,
    ratingAvg: 5.0,
    ratingCount: 52,
  },
  {
    name: "Box de 12 mini brownies",
    slug: "box-12-mini-brownies",
    description:
      "Une petite bombe de douceur au chocolat intense et pur beurre. Moins sucré que la version classique, mais mille fois plus fondant : pépites de chocolat noir et croquant délicat de noix toastées. Pour les vrais amoureux du chocolat.",
    price: 9500,
    categorySlug: "brownies",
    images: ["/images/products/box-12-mini-brownies.jpg"],
    weightGrams: 360,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Chocolat noir", "Beurre", "Œufs", "Noix", "Farine", "Sucre"],
    stock: 40,
    badge: ProductBadge.NEW,
    ratingAvg: 4.9,
    ratingCount: 38,
  },

  // ---------------- GÂTEAUX & ENTREMETS ----------------
  {
    name: "Gâteau chocolat praliné",
    slug: "gateau-chocolat-praline",
    description:
      "Un gâteau chocolat moelleux, garni d'une ganache onctueuse, enrobé d'un chocolat rocher aux éclats d'amandes. Au sommet, un irrésistible croquant praliné amande-noisette, décoré avec élégance. Le parfait équilibre entre fondant, croquant et intensité chocolatée.",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "gateaux",
    images: ["/images/products/gateau-chocolat-praline.jpg"],
    weightGrams: 900,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Chocolat", "Praliné amande-noisette", "Crème", "Beurre", "Œufs", "Amandes"],
    stock: 10,
    badge: ProductBadge.BEST_SELLER,
    ratingAvg: 5.0,
    ratingCount: 73,
  },
  {
    name: "Gâteau cœur fondant au citron",
    slug: "gateau-coeur-fondant-citron",
    description:
      "Un gâteau de voyage au cœur fondant citron, habillé d'un croquant chocolat blanc-pistache. Une bouchée, et c'est la promesse du fondant, du croustillant et de la fraîcheur citronnée.",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "gateaux",
    images: ["/images/products/gateau-coeur-fondant-citron.jpg"],
    weightGrams: 650,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Citron", "Chocolat blanc", "Pistache", "Beurre", "Œufs", "Farine"],
    stock: 12,
    ratingAvg: 4.8,
    ratingCount: 29,
  },
  {
    name: "Konafa au fromage",
    slug: "konafa-fromage",
    description:
      "Préparée avec une cream cheese maison délicatement parfumée à la fleur d'oranger. Moins sucrée, sans sucre ajouté, décorée d'amandes et de pistaches. Une douceur équilibrée, fondante et raffinée.",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "gateaux",
    images: ["/images/products/konafa-fromage.jpg"],
    weightGrams: 700,
    allergens: ["Gluten", "Lait", "Fruits à coque"],
    ingredients: ["Kunafa", "Cream cheese maison", "Fleur d'oranger", "Amandes", "Pistaches", "Beurre"],
    stock: 14,
    ratingAvg: 4.9,
    ratingCount: 31,
  },
  {
    name: "Basboussa Cheesecake",
    slug: "basboussa-cheesecake",
    description:
      "Base croustillante au biscuit beurré, cœur cheesecake ultra fondant au cream cheese et touche d'amande, basboussa moelleuse à la semoule parfumée à la fleur d'oranger et imbibée d'un sirop maison au caramel. Touche finale : amandes effilées, pistaches concassées et pétales de rose.",
    price: 22000,
    categorySlug: "gateaux",
    images: ["/images/products/basboussa-cheesecake.jpg"],
    weightGrams: 800,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Semoule", "Cream cheese", "Biscuit beurré", "Fleur d'oranger", "Amandes", "Pistaches"],
    stock: 12,
    badge: ProductBadge.BEST_SELLER,
    ratingAvg: 5.0,
    ratingCount: 47,
  },

  // ---------------- VIENNOISERIES & BRIOCHES ----------------
  {
    name: "Tressée fondante",
    slug: "tressee-fondante",
    description:
      "Une brioche moelleuse, délicatement tressée à la main, à la mie filante. À l'intérieur : un cœur généreux de chocolat fondant et de caramel doré, fait maison. Réconfort, tendresse et gourmandise à chaque bouchée.",
    price: 12000,
    categorySlug: "viennoiseries",
    images: ["/images/products/tressee-fondante.jpg"],
    weightGrams: 450,
    allergens: ["Gluten", "Lait", "Œufs"],
    ingredients: ["Farine", "Beurre", "Œufs", "Chocolat", "Caramel maison", "Lait"],
    stock: 20,
    ratingAvg: 4.9,
    ratingCount: 36,
  },
  {
    name: "Box de 4 cinnamon rolls",
    slug: "box-4-cinnamon-rolls",
    description:
      "Un tourbillon de douceur : notre cinnamon roll maison, généreusement roulé à la cannelle puis nappé de sa crème cheesecake onctueuse. Moelleux, fondant, réconfortant.",
    price: 10500,
    categorySlug: "viennoiseries",
    images: ["/images/products/box-4-cinnamon-rolls.jpg"],
    weightGrams: 400,
    allergens: ["Gluten", "Lait", "Œufs"],
    ingredients: ["Farine", "Beurre", "Cannelle", "Cream cheese", "Sucre", "Œufs"],
    stock: 25,
    badge: ProductBadge.NEW,
    ratingAvg: 4.9,
    ratingCount: 28,
  },
  {
    name: "Madeleines enrobées chocolat",
    slug: "madeleines-enrobees-chocolat",
    description:
      "Nos madeleines pur beurre, enrobées d'un chocolat fondant. Chaque bouchée est une petite dose de bonheur. À l'unité ou en boîte personnalisée.",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "viennoiseries",
    images: ["/images/products/madeleines-enrobees-chocolat.jpg"],
    weightGrams: 300,
    allergens: ["Gluten", "Lait", "Œufs"],
    ingredients: ["Farine", "Beurre", "Œufs", "Chocolat", "Sucre", "Miel"],
    stock: 35,
    ratingAvg: 4.8,
    ratingCount: 24,
  },
  {
    name: "Mini cannelés maison",
    slug: "mini-canneles",
    description:
      "Croustillants à l'extérieur, tendres et fondants à l'intérieur. Ces petits trésors caramélisés sont préparés avec patience et une touche de vanille. À picorer, à partager (ou pas).",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "viennoiseries",
    images: ["/images/products/mini-canneles.jpg"],
    weightGrams: 300,
    allergens: ["Gluten", "Lait", "Œufs"],
    ingredients: ["Farine", "Lait", "Œufs", "Vanille", "Sucre", "Beurre"],
    stock: 40,
    ratingAvg: 4.8,
    ratingCount: 22,
  },
  {
    name: "Croustillant amande",
    slug: "croustillant-amande",
    description:
      "Un croustillant amande à la texture irrésistible : une pâte délicatement croustillante, un cœur fondant aux amandes, et ce léger éclat salé qui sublime chaque bouchée.",
    price: 22000,
    categorySlug: "viennoiseries",
    images: ["/images/products/croustillant-amande.jpg"],
    weightGrams: 500,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Pâte feuilletée", "Amandes", "Beurre", "Sucre", "Œufs"],
    stock: 18,
    ratingAvg: 4.7,
    ratingCount: 19,
  },

  // ---------------- BOX & COFFRETS ----------------
  {
    name: "Box Goûter Scolaire",
    slug: "box-gouter-scolaire",
    description:
      "Une semaine de douceurs maison pour vos enfants : 12 mini cookies (chocolat & new-yorkais), 12 madeleines enrobées (chocolat blanc & noir) et 11 brioches moelleuses fourrées au chocolat. Des goûters déjà prêts, variés et faits maison avec amour.",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "box-coffrets",
    images: ["/images/products/box-gouter-scolaire.jpg"],
    weightGrams: 1200,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Cookies", "Madeleines", "Brioches", "Chocolat", "Beurre"],
    stock: 20,
    badge: ProductBadge.BEST_SELLER,
    ratingAvg: 5.0,
    ratingCount: 44,
  },
  {
    name: "Box de 12 muffins variés",
    slug: "box-12-muffins",
    description:
      "Chez Four & Cœur, le muffin est un nuage moelleux, généreux, fait maison : citron & cœur de lemon curd, chocolat fondant, fruit rouge éclatant, crumble aux noix et caramel coulant. Des saveurs qui réconfortent.",
    price: 19500,
    categorySlug: "box-coffrets",
    images: ["/images/products/box-12-muffins.jpg"],
    weightGrams: 900,
    allergens: ["Gluten", "Lait", "Œufs", "Fruits à coque"],
    ingredients: ["Farine", "Beurre", "Œufs", "Citron", "Chocolat", "Fruits rouges", "Caramel"],
    stock: 25,
    ratingAvg: 4.8,
    ratingCount: 31,
  },

  // ---------------- PETIT-DÉJEUNER ----------------
  {
    name: "Granola maison",
    slug: "granola-maison",
    description:
      "Granola 100% fait maison, croquant et plein d'énergie. Sans sucres raffinés, plein de fibres : avoine, fruits secs, graines, huile de coco et miel. Parfait pour le petit-déj ou en snack. Format 250 g (un format 500 g est disponible sur demande).",
    price: 5000,
    categorySlug: "petit-dejeuner",
    images: ["/images/products/granola-maison.jpg"],
    weightGrams: 250,
    allergens: ["Fruits à coque", "Avoine (gluten)"],
    ingredients: ["Avoine", "Fruits secs", "Graines", "Huile de coco", "Miel"],
    stock: 30,
    badge: ProductBadge.NEW,
    ratingAvg: 4.9,
    ratingCount: 26,
  },

  // ---------------- SALÉ ----------------
  {
    name: "Plateau salé",
    slug: "plateau-sale",
    description:
      "Un plateau salé qui met tout le monde d'accord, composé selon vos envies : pizza, tacos, burger, quiche, wrap, verrine salée, mini sandwich. Déclinés au thon, saumon, poulet, viande hachée ou épinards. Idéal pour un goûter, un brunch ou un apéro dînatoire.",
    price: 27000,
    categorySlug: "sale",
    images: ["/images/products/plateau-sale.jpg"],
    weightGrams: 1500,
    allergens: ["Gluten", "Lait", "Œufs", "Poisson"],
    ingredients: ["Pâtes maison", "Légumes frais", "Fromage", "Thon", "Saumon", "Poulet"],
    stock: 8,
    ratingAvg: 4.9,
    ratingCount: 35,
  },
  {
    name: "Plateau salé 48 pièces",
    slug: "plateau-sale-48",
    description:
      "48 pièces soigneusement préparées, pâtes 100% maison, zéro charcuterie industrielle, pur beurre. Mini quiches, feuilletés dorés, pastillas fines, bébé sandwichs, mini burgers, mini tacos, cigares croustillants et éclairs au saumon. Parfait pour vos événements.",
    price: 99900,
    estimatedPrice: true,
    categorySlug: "sale",
    images: ["/images/products/plateau-sale-48.jpg"],
    weightGrams: 2200,
    allergens: ["Gluten", "Lait", "Œufs", "Poisson"],
    ingredients: ["Pâtes maison", "Légumes", "Fromage", "Saumon", "Viande", "Beurre"],
    stock: 6,
    badge: ProductBadge.BEST_SELLER,
    ratingAvg: 5.0,
    ratingCount: 22,
  },
];

const coupons = [
  {
    code: "BIENVENUE10",
    description: "10% de réduction sur votre première commande",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    minSubtotal: 10000,
    maxUses: null as number | null,
    isActive: true,
  },
  {
    code: "GOURMAND50",
    description: "50 MAD offerts dès 500 MAD d'achat",
    discountType: DiscountType.FIXED,
    discountValue: 5000,
    minSubtotal: 50000,
    maxUses: 200,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Seed Four & Cœur…");

  // Nettoyage du catalogue existant (les commandes conservent leur snapshot).
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("  ✓ Ancien catalogue nettoyé");

  // --- Catégories ---
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.create({ data: c });
    categoryMap.set(c.slug, cat.id);
  }
  console.log(`  ✓ ${categories.length} catégories`);

  // --- Produits ---
  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) throw new Error(`Catégorie introuvable: ${p.categorySlug}`);
    const { categorySlug, estimatedPrice, ...rest } = p;
    void estimatedPrice;
    await prisma.product.create({ data: { ...rest, categoryId } });
  }
  console.log(`  ✓ ${products.length} produits`);

  // --- Coupons ---
  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: c, create: c });
  }
  console.log(`  ✓ ${coupons.length} codes promo`);

  // --- Administrateur ---
  const adminEmail = "admin@foure-coeur.com";
  const adminPassword = "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: { email: adminEmail, name: "Administrateur", role: Role.ADMIN, passwordHash },
  });
  console.log(`  ✓ Admin (${adminEmail} / ${adminPassword})`);

  console.log("✅ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
