import { type ReactNode } from "react";
import { requireUser } from "@/lib/session";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="bg-ivory pb-24 pt-28 md:pt-32">
      <div className="container-px mx-auto max-w-[100rem]">
        <header className="border-b border-border pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-caramel">
            Mon espace
          </p>
          <h1 className="mt-2 font-heading text-3xl font-light text-chocolate sm:text-4xl">
            Bonjour {user.name?.split(" ")[0] ?? "à vous"}
          </h1>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <AccountNav />
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
