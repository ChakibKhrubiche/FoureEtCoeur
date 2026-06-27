import { type ReactNode } from "react";
import { Logo } from "@/components/layout/logo";

/** Cadre centré et élégant pour les pages d'authentification. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 py-28">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size={96} />
          <h1 className="mt-8 font-heading text-3xl font-light text-chocolate">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="rounded-3xl border border-border bg-warm-white p-8 shadow-[0_8px_40px_-12px_rgba(60,40,30,0.1)]">
          {children}
        </div>
      </div>
    </div>
  );
}
