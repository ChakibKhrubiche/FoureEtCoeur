/**
 * Recolorise le logo Four & Cœur pour l'harmoniser à la palette du site
 * (chocolat profond + cœur doré) via Gemini (Nano Banana) en édition d'image.
 * Conserve EXACTEMENT le dessin et le lettrage, change seulement les couleurs.
 *
 * Usage : npx tsx scripts/recolor-logo.ts
 */

import { GoogleGenAI } from "@google/genai";
import { config as loadEnv } from "dotenv";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

loadEnv({ path: ".env.local" });
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image";

const SRC = join(process.cwd(), "ImagesInstagram", "LOGO.jpg");
const OUT_DIR = join(process.cwd(), "public", "images", "brand");

const PROMPT =
  "Recolor this logo to match a luxury brand palette. " +
  "Change the terracotta/clay color of the script lettering 'Four & Cœur', the oven illustration, " +
  "the underline flourish and the bottom text 'DOUCEURS FAITES MAISON' to a deep warm chocolate brown (#3b2a20). " +
  "Make the small heart above the text and the heart inside the oven a soft muted gold (#c2a063). " +
  "Keep the EXACT same design, composition, lettering, spelling, fonts and proportions — only change the colors. " +
  "Place the artwork on a completely flat, uniform warm ivory background of the single solid color #FBF8F3. " +
  "Absolutely DO NOT draw any checkerboard, grid, squares or transparency pattern — the background must be one plain solid ivory color only. " +
  "High resolution, crisp clean vector-like edges.";

async function main() {
  if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY manquante");
    process.exit(1);
  }

  const imageBytes = readFileSync(SRC).toString("base64");
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBytes } },
          { text: PROMPT },
        ],
      },
    ],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img?.inlineData?.data) {
    const t = parts.find((p) => p.text)?.text;
    throw new Error(`Pas d'image renvoyée${t ? ` — ${t.slice(0, 150)}` : ""}`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const ext = img.inlineData.mimeType?.includes("png") ? "png" : "jpg";
  const out = join(OUT_DIR, `logo.${ext}`);
  writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
  console.log(`✅ Logo recolorisé : public/images/brand/logo.${ext} (${img.inlineData.mimeType})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
