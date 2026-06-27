import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise les images locales avec ou sans paramètre de version (?v=N).
    // En cas de bump d'ASSET_VERSION (src/config/site.ts), ajouter le search ici.
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/images/**", search: "?v=3" },
    ],
  },
};

export default nextConfig;
