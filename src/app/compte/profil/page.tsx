import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/account/profile-form";

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, email: true, phone: true },
  });

  return (
    <div>
      <h2 className="font-heading text-2xl text-chocolate">Mon profil</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Gérez vos informations personnelles.
      </p>
      <div className="mt-8">
        <ProfileForm
          defaultName={user?.name ?? ""}
          defaultPhone={user?.phone ?? ""}
          email={user?.email ?? ""}
        />
      </div>
    </div>
  );
}
