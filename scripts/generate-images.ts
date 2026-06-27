/**
 * Génère toutes les images du site avec Gemini 2.5 Flash Image ("Nano Banana").
 *
 * Pré-requis : GEMINI_API_KEY défini dans `.env.local`.
 * Usage :
 *   npm run images:generate                 # génère les images manquantes
 *   npm run images:generate -- --force      # régénère tout
 *   npm run images:generate -- --only=hero  # cible les chemins contenant "hero"
 */

import { GoogleGenAI } from "@google/genai";
import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { IMAGE_PROMPTS, buildPrompt, type ImagePrompt } from "./image-prompts";

// Charge .env.local (clé Gemini) puis .env en complément.
loadEnv({ path: ".env.local" });
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
// "Nano Banana 2" = Gemini 3 Pro Image. Override possible via GEMINI_IMAGE_MODEL
// ou l'argument --model=... (ex: gemini-3.1-flash-image, gemini-2.5-flash-image).
const PUBLIC_DIR = join(process.cwd(), "public");
const DELAY_MS = 1500; // throttle entre les appels

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.split("=")[1] : null;
const modelArg = args.find((a) => a.startsWith("--model="));
const MODEL =
  (modelArg ? modelArg.split("=")[1] : null) ??
  process.env.GEMINI_IMAGE_MODEL ??
  "gemini-3-pro-image";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function generateOne(ai: GoogleGenAI, item: ImagePrompt): Promise<boolean> {
  const outPath = join(PUBLIC_DIR, item.path);

  if (!force && existsSync(outPath)) {
    console.log(`  ⏭️  ${item.path} (déjà présent)`);
    return false;
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildPrompt(item),
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    const textPart = parts.find((p) => p.text)?.text;
    throw new Error(
      `Aucune image renvoyée${textPart ? ` — réponse: ${textPart.slice(0, 120)}` : ""}`,
    );
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`  ✅ ${item.path}`);
  return true;
}

async function main() {
  if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY manquante dans .env.local");
    process.exit(1);
  }

  const queue = only
    ? IMAGE_PROMPTS.filter((p) => p.path.includes(only))
    : IMAGE_PROMPTS;

  console.log(
    `🍌 Génération de ${queue.length} image(s) avec ${MODEL}${force ? " (force)" : ""}…\n`,
  );

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  let generated = 0;
  const failures: string[] = [];

  for (const item of queue) {
    try {
      const didGenerate = await generateOne(ai, item);
      if (didGenerate) {
        generated++;
        await sleep(DELAY_MS);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ ${item.path} — ${msg}`);
      failures.push(item.path);
    }
  }

  console.log(`\n✨ Terminé : ${generated} générée(s), ${failures.length} échec(s).`);
  if (failures.length) {
    console.log("   Échecs :", failures.join(", "));
    console.log("   Relancer la commande pour réessayer uniquement les manquantes.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
