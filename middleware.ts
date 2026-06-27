import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Middleware Edge-safe : protège /compte et /admin (redirige vers /connexion si non connecté).
// Le contrôle de rôle ADMIN est renforcé côté layout serveur.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/compte/:path*", "/admin/:path*"],
};
