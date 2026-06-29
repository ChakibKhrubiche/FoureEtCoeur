import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-chocolate-dark lg:block">
        <AdminNav />
      </aside>

      {/* Contenu */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-[100rem] px-6 py-8 md:px-10">{children}</div>
      </div>
    </div>
  );
}
