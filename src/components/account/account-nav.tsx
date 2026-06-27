"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, MapPin, Heart, Package, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const links = [
  { href: "/compte", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/compte/commandes", label: "Mes commandes", icon: Package },
  { href: "/compte/favoris", label: "Mes favoris", icon: Heart },
  { href: "/compte/adresses", label: "Mes adresses", icon: MapPin },
  { href: "/compte/profil", label: "Mon profil", icon: User },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
              active
                ? "bg-chocolate text-primary-foreground"
                : "text-chocolate/80 hover:bg-secondary",
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        );
      })}

      <form action={logoutAction} className="mt-4 border-t border-border pt-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-chocolate"
        >
          <LogOut className="size-4" />
          Se déconnecter
        </button>
      </form>
    </nav>
  );
}
