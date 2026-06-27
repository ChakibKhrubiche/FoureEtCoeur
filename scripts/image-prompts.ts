/**
 * Prompts "Nano Banana" (Gemini 2.5 Flash Image) pour générer tous les visuels
 * de Foure & Coeur. Style : photographie culinaire haut de gamme, lumière
 * naturelle, fond minimaliste, tons crème/beige/chocolat chaleureux.
 *
 * Chaque entrée écrit un fichier dans `public/<path>`.
 * Lancer la génération : `npm run images:generate`
 *   - ajouter `--force` pour régénérer les images déjà présentes
 *   - ajouter `--only=hero` (ou un autre mot-clé du chemin) pour cibler un sous-ensemble
 */

/** Style commun appliqué à toutes les images (rendu marque cohérent). */
export const STYLE_SUFFIX =
  "Ultra realistic, high-end culinary magazine photography, soft natural morning light, " +
  "shallow depth of field, warm cream and beige minimalist background, subtle linen and " +
  "warm wooden textures, refined elegant composition, lots of breathing room, gentle shadows, " +
  "no text, no watermark, no people's faces, photorealistic, 4k, color palette of ivory, cream, " +
  "beige, sand, light caramel, chocolate brown and soft gold.";

export interface ImagePrompt {
  /** Chemin relatif à `public/` (avec extension). */
  path: string;
  /** Description du sujet (le style commun est ajouté automatiquement). */
  prompt: string;
  /** Orientation souhaitée (indice intégré au prompt). */
  aspect?: "square" | "landscape" | "portrait";
}

const aspectHint: Record<NonNullable<ImagePrompt["aspect"]>, string> = {
  square: "Square 1:1 composition.",
  landscape: "Wide cinematic landscape 16:9 composition.",
  portrait: "Vertical portrait 4:5 composition.",
};

/** Construit le prompt final (sujet + orientation + style commun). */
export function buildPrompt(p: ImagePrompt): string {
  const aspect = p.aspect ? ` ${aspectHint[p.aspect]}` : "";
  return `${p.prompt}${aspect} ${STYLE_SUFFIX}`;
}

export const IMAGE_PROMPTS: ImagePrompt[] = [
  // ---------------- HERO ----------------
  {
    path: "images/hero/hero-main.jpg",
    aspect: "landscape",
    prompt:
      "A breathtaking hero scene of fresh handmade French pastries beautifully arranged on a " +
      "refined marble and light wood table: golden croissants, glossy fruit tarts, an elegant " +
      "layered cake, macarons in pastel tones, artisan bread, on delicate ceramic serving plates " +
      "with soft linen napkins, illuminated by soft natural morning light streaming from the side.",
  },
  {
    path: "images/hero/hero-texture.jpg",
    aspect: "landscape",
    prompt:
      "An abstract close-up of a creamy beige pastry surface and soft flour dusting, extremely " +
      "minimalist, almost monochrome warm cream tones, used as a subtle background texture.",
  },

  // ------------- CATÉGORIES -------------
  {
    path: "images/categories/gateaux.jpg",
    aspect: "portrait",
    prompt:
      "A single exquisite artisanal layered cake with smooth chocolate glaze and delicate gold " +
      "leaf detail, presented on an elegant ceramic stand.",
  },
  {
    path: "images/categories/macarons.jpg",
    aspect: "portrait",
    prompt:
      "An elegant row of pastel French macarons (pistachio, raspberry, vanilla, caramel) with " +
      "perfectly smooth shells, neatly aligned on a cream linen surface.",
  },
  {
    path: "images/categories/viennoiseries.jpg",
    aspect: "portrait",
    prompt:
      "Freshly baked golden butter croissants and pains au chocolat with flaky crisp layers, " +
      "arranged on a warm wooden board with light flour dusting.",
  },
  {
    path: "images/categories/tartes.jpg",
    aspect: "portrait",
    prompt:
      "A beautiful seasonal fruit tart with glossy fresh berries and figs over vanilla cream on a " +
      "crisp golden shortcrust, on a refined plate.",
  },
  {
    path: "images/categories/cookies.jpg",
    aspect: "portrait",
    prompt:
      "Generous triple-chocolate cookies, crisp edges and gooey melting centers, stacked on " +
      "parchment paper with chocolate chunks scattered around.",
  },
  {
    path: "images/categories/desserts.jpg",
    aspect: "portrait",
    prompt:
      "A refined plated dessert: an elegant Paris-Brest with praline cream and almond flakes, " +
      "dusted with icing sugar, on a fine porcelain plate.",
  },

  // ------------- PRODUITS -------------
  {
    path: "images/products/entremets-chocolat.jpg",
    aspect: "square",
    prompt:
      "A luxurious chocolate entremets with a mirror-glaze dark chocolate finish, a thin gold leaf " +
      "accent, and a clean cross-section hint of mousse and praline, on a minimalist plate.",
  },
  {
    path: "images/products/fraisier.jpg",
    aspect: "square",
    prompt:
      "A classic French fraisier cake showing neat rows of fresh halved strawberries along the " +
      "side, vanilla mousseline cream and sponge, topped with a smooth pale glaze.",
  },
  {
    path: "images/products/coffret-macarons.jpg",
    aspect: "square",
    prompt:
      "An elegant open gift box of twelve assorted pastel French macarons in neat rows, soft " +
      "warm light, premium packaging in cream and gold.",
  },
  {
    path: "images/products/macaron-pistache.jpg",
    aspect: "square",
    prompt:
      "A single pistachio macaron, smooth green shell with delicate feet, a hint of pistachio " +
      "ganache visible, on a cream surface, extreme close-up.",
  },
  {
    path: "images/products/croissant.jpg",
    aspect: "square",
    prompt:
      "A single perfect golden butter croissant with crisp flaky layers, on a warm wooden board " +
      "with subtle flour dusting.",
  },
  {
    path: "images/products/pain-au-chocolat.jpg",
    aspect: "square",
    prompt:
      "A single pain au chocolat, golden flaky pastry with dark chocolate visible at the ends, on " +
      "a warm wooden board.",
  },
  {
    path: "images/products/tarte-citron.jpg",
    aspect: "square",
    prompt:
      "A lemon meringue tart with lightly torched Italian meringue peaks over bright lemon curd in " +
      "a crisp shortcrust shell, on a refined plate.",
  },
  {
    path: "images/products/tarte-fruits.jpg",
    aspect: "square",
    prompt:
      "A seasonal fruit tart topped with glossy fresh strawberries, raspberries, blueberries and " +
      "figs over vanilla pastry cream on golden shortcrust.",
  },
  {
    path: "images/products/cookie-chocolat.jpg",
    aspect: "square",
    prompt:
      "A single triple-chocolate cookie with melting chocolate chunks, crisp edges and gooey " +
      "center, on parchment paper.",
  },
  {
    path: "images/products/cookie-pecan.jpg",
    aspect: "square",
    prompt:
      "A single soft pecan and salted-caramel cookie with toasted pecans and caramel pieces, on " +
      "parchment paper.",
  },
  {
    path: "images/products/paris-brest.jpg",
    aspect: "square",
    prompt:
      "A classic Paris-Brest: a ring of crisp choux pastry filled with hazelnut praline mousseline " +
      "cream, topped with toasted almond flakes and icing sugar, on a fine plate.",
  },
  {
    path: "images/products/saint-honore.jpg",
    aspect: "square",
    prompt:
      "An elegant Saint-Honoré with caramelized cream puffs and piped vanilla bourbon chantilly on " +
      "puff pastry, refined and airy presentation.",
  },

  // ------------- STORYTELLING / SECTIONS -------------
  {
    path: "images/sections/art-of-homemade.jpg",
    aspect: "portrait",
    prompt:
      "An artisan pastry chef's hands delicately piping cream onto a dessert in a bright minimalist " +
      "atelier, warm natural light, focus on craftsmanship and detail, no visible face.",
  },
  {
    path: "images/sections/ingredients.jpg",
    aspect: "landscape",
    prompt:
      "A flat lay of premium baking ingredients on a cream surface: fresh butter, vanilla pods, " +
      "dark chocolate, eggs, flour, hazelnuts and fresh berries, organic natural arrangement.",
  },
  {
    path: "images/sections/atelier.jpg",
    aspect: "landscape",
    prompt:
      "A serene minimalist pastry atelier interior with marble worktop, soft daylight, neatly " +
      "arranged tools and a few finished pastries, warm and refined atmosphere.",
  },

  // ------------- LIFESTYLE / BANNIÈRES -------------
  {
    path: "images/lifestyle/table-share.jpg",
    aspect: "landscape",
    prompt:
      "A warm lifestyle scene of an elegantly set table with assorted pastries, coffee cups and " +
      "linen, ready to share, soft morning light, inviting and cozy luxury.",
  },
  {
    path: "images/lifestyle/gift.jpg",
    aspect: "portrait",
    prompt:
      "A beautifully wrapped pastry gift box with a satin ribbon in cream and gold tones, held " +
      "gently, premium and emotional, soft light.",
  },
  {
    path: "images/banners/call-to-order.jpg",
    aspect: "landscape",
    prompt:
      "A wide elegant banner of an assortment of premium pastries on a cream surface with generous " +
      "empty space on the right for text overlay, soft warm light.",
  },

  // ------------- FONDS -------------
  {
    path: "images/backgrounds/cream-paper.jpg",
    aspect: "landscape",
    prompt:
      "A very subtle minimalist warm cream paper texture background, almost plain, gentle grain, " +
      "no objects.",
  },

  // ------------- PRODUITS RÉELS (Four & Cœur) -------------
  {
    path: "images/products/gateau-chocolat-praline.jpg",
    aspect: "square",
    prompt:
      "A luxurious homemade chocolate log cake: moist chocolate sponge rolled around a chocolate cream center, " +
      "fully coated in glossy crunchy chocolate rocher, topped with piped chocolate ganache rosettes, whole roasted " +
      "hazelnuts and a touch of caramel, one end showing the soft cream center, on a white plate.",
  },
  {
    path: "images/products/brownies-ultra-gourmands.jpg",
    aspect: "square",
    prompt:
      "A box of ultra-gourmet homemade brownies, thick and fudgy, generously topped and stuffed with hazelnut cream, " +
      "pistachio kunafa, crunchy speculoos and intense melting chocolate, arranged neatly in an elegant box.",
  },
  {
    path: "images/products/gateau-coeur-fondant-citron.jpg",
    aspect: "square",
    prompt:
      "A homemade lemon loaf cake with a molten lemon cream core, coated in a white-chocolate and pistachio crackle " +
      "glaze, topped with piped cream rosettes, crushed pistachios and candied lime slices, one slice cut showing the " +
      "creamy center, on a white platter.",
  },
  {
    path: "images/products/box-12-mini-cookies-garnis.jpg",
    aspect: "square",
    prompt:
      "A box of twelve assorted stuffed mini cookies — red velvet, speculoos, chocolate, pistachio and New York style — " +
      "golden and gooey with melting centers, neatly arranged.",
  },
  {
    path: "images/products/croustillant-amande.jpg",
    aspect: "square",
    prompt:
      "A homemade almond croustillant pastry: delicate crisp golden flaky pastry with a soft almond center and toasted " +
      "sliced almonds on top, lightly caramelized, one piece on a refined plate.",
  },
  {
    path: "images/products/konafa-fromage.jpg",
    aspect: "square",
    prompt:
      "Individual round kunafa nests made of crispy golden shredded kunafa pastry filled with melting cheese, topped " +
      "with crushed almonds and pistachios, lightly drizzled with syrup, arranged in a kraft box.",
  },
  {
    path: "images/products/box-gouter-scolaire.jpg",
    aspect: "square",
    prompt:
      "An assortment snack box: mini chocolate-chip cookies, almond-coated cream pastries, chocolate-glazed mini cakes " +
      "with caramel drizzle and coconut-coated brioche fingers, generously filled in a white box.",
  },
  {
    path: "images/products/madeleines-enrobees-chocolat.jpg",
    aspect: "square",
    prompt:
      "Homemade French butter madeleines half-dipped in glossy dark and white chocolate, classic shell shape visible, " +
      "arranged elegantly on parchment.",
  },
  {
    path: "images/products/granola-maison.jpg",
    aspect: "square",
    prompt:
      "Homemade golden granola clusters with oats, dried fruits, seeds and nuts served in a ceramic bowl, a drizzle of " +
      "honey and a few scattered oats around, wholesome and crunchy.",
  },
  {
    path: "images/products/mini-canneles.jpg",
    aspect: "square",
    prompt:
      "Homemade mini French cannelés with a deep caramelized mahogany crust and tender custard inside, glossy, several " +
      "arranged closely, a few stacked, on a refined surface.",
  },
  {
    path: "images/products/plateau-sale.jpg",
    aspect: "square",
    prompt:
      "A savory party platter of assorted homemade mini bites: mini pizzas, tortilla wrap pinwheels with cream, mini " +
      "quiches and small savory verrines, freshly made, arranged generously in a kraft tray.",
  },
  {
    path: "images/products/basboussa-cheesecake.jpg",
    aspect: "square",
    prompt:
      "A homemade basboussa cheesecake square slice: golden semolina basboussa top scented with orange blossom, a creamy " +
      "cheesecake middle layer and a buttery biscuit base, topped with toasted sliced almonds, crushed pistachios and " +
      "dried rose petals, on a plate.",
  },
  {
    path: "images/products/box-4-cinnamon-rolls.jpg",
    aspect: "square",
    prompt:
      "Four homemade cinnamon rolls with soft spiral swirls, generously glazed with cream cheese frosting, gooey and " +
      "golden, arranged in a box.",
  },
  {
    path: "images/products/cookie-geant-fourre.jpg",
    aspect: "square",
    prompt:
      "A giant homemade stuffed cookie, golden and crisp outside, broken in half to reveal a melting gooey chocolate " +
      "center stretching, fresh from the oven.",
  },
  {
    path: "images/products/box-12-mini-cookies.jpg",
    aspect: "square",
    prompt:
      "Twelve soft homemade mini cookies with white and dark chocolate chips, walnuts and peanuts, child-friendly snack " +
      "size, in a simple kraft pouch/box.",
  },
  {
    path: "images/products/tressee-fondante.jpg",
    aspect: "square",
    prompt:
      "A homemade braided brioche loaf (babka style), glossy golden-brown twisted dough revealing chocolate and caramel " +
      "swirls inside, on a wooden board.",
  },
  {
    path: "images/products/box-12-mini-brownies.jpg",
    aspect: "square",
    prompt:
      "A box of twelve fudgy mini brownies with melting dark chocolate chunks and toasted walnuts, rich, moist and less " +
      "sweet, neatly arranged.",
  },
  {
    path: "images/products/plateau-sale-48.jpg",
    aspect: "square",
    prompt:
      "A large generous savory platter with assorted homemade bites: mini quiches, golden puff pastries, fine pastillas, " +
      "mini sandwiches, mini burgers, mini tacos, crispy cigars and salmon éclairs, beautifully arranged in a kraft tray.",
  },
  {
    path: "images/products/box-12-muffins.jpg",
    aspect: "square",
    prompt:
      "A box of twelve assorted homemade muffins: lemon with lemon-curd center, melting chocolate, red berry, and " +
      "walnut-caramel crumble, fluffy and generous.",
  },
  {
    path: "images/products/cookie-choco-caramel.jpg",
    aspect: "square",
    prompt:
      "A single homemade signature cookie, soft and thick, generously filled with salted butter caramel and dark " +
      "chocolate ganache, broken to show oozing caramel and melting chocolate, fresh and gourmet.",
  },
];
