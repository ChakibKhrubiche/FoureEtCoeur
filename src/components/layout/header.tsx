"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { CartBadge } from "@/components/layout/cart-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-ivory/90 shadow-[0_4px_30px_-12px_rgba(60,40,30,0.15)]"
          : "bg-ivory/70",
      )}
    >
      <div className="container-px mx-auto flex h-20 max-w-[100rem] items-center justify-between py-3">
        {/* Nav gauche (desktop) */}
        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm tracking-wide text-chocolate/80 transition-colors hover:text-chocolate",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300",
                  active ? "text-chocolate after:w-full" : "after:w-0 hover:after:w-full",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Logo centré */}
        <div className="flex flex-1 justify-start lg:justify-center">
          <Logo size={60} priority />
        </div>

        {/* Actions droite */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Mes favoris"
          >
            <Link href="/compte/favoris">
              <Heart className="size-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Mon compte"
          >
            <Link href="/compte">
              <User className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Panier">
            <Link href="/panier" className="relative">
              <ShoppingBag className="size-5" />
              <CartBadge />
            </Link>
          </Button>

          {/* Menu mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Ouvrir le menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-ivory">
              <SheetHeader>
                <SheetTitle className="font-heading text-left text-2xl">
                  Four<span className="text-gold">&</span>Cœur
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-lg text-chocolate/90 transition-colors hover:bg-secondary"
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                <Link
                  href="/compte"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-chocolate/80 hover:bg-secondary"
                >
                  Mon compte
                </Link>
                <Link
                  href="/compte/favoris"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-chocolate/80 hover:bg-secondary"
                >
                  Mes favoris
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
