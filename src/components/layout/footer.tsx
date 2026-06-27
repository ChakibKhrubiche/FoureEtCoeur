import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Logo } from "@/components/layout/logo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-warm-white">
      <div className="container-px mx-auto max-w-[100rem] py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Marque + newsletter */}
          <div className="lg:col-span-5">
            <Logo size={120} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-8 max-w-sm">
              <p className="mb-3 text-sm font-medium text-chocolate">
                Recevez nos nouveautés
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Colonnes de navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterColumn title="Boutique" links={footerNav.boutique} />
            <FooterColumn title="La maison" links={footerNav.maison} />
            <FooterColumn title="Informations" links={footerNav.legal} />
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-caramel">
              Contact
            </p>
            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p>{siteConfig.contact.address}</p>
              <p>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-chocolate"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-chocolate"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </address>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-chocolate/60 transition-colors hover:text-gold"
              >
                <InstagramIcon className="size-5" />
              </a>
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-chocolate/60 transition-colors hover:text-gold"
              >
                <FacebookIcon className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
          <p>Fait main, avec passion — au Maroc.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { title: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-caramel">
        {title}
      </p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-chocolate"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
