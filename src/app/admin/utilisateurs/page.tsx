import { adminRepository } from "@/repositories/admin.repository";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { AdminSearch } from "@/components/admin/admin-search";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const users = await adminRepository.listUsers({ search: sp.q });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-3xl text-chocolate">Utilisateurs</h1>
        <p className="mt-1 text-sm text-muted-foreground">{users.length} compte(s)</p>
      </header>

      <AdminSearch placeholder="Nom ou e-mail…" />

      <div className="overflow-x-auto rounded-2xl border border-border bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Nom</th>
              <th className="p-4 font-medium">E-mail</th>
              <th className="p-4 font-medium">Téléphone</th>
              <th className="p-4 font-medium">Rôle</th>
              <th className="p-4 font-medium">Commandes</th>
              <th className="p-4 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50 last:border-0">
                <td className="p-4 font-medium text-chocolate">{u.name ?? "—"}</td>
                <td className="p-4 text-muted-foreground">{u.email}</td>
                <td className="p-4 text-muted-foreground">{u.phone ?? "—"}</td>
                <td className="p-4">
                  <Badge
                    variant={u.role === "ADMIN" ? "default" : "outline"}
                    className="rounded-full text-xs"
                  >
                    {u.role === "ADMIN" ? "Admin" : "Client"}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground">{u._count.orders}</td>
                <td className="p-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  Aucun utilisateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
