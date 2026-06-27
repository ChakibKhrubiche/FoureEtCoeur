"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  defaultName,
  defaultPhone,
  email,
}: {
  defaultName: string;
  defaultPhone: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, {});

  useEffect(() => {
    if (state.success) toast.success("Profil mis à jour");
  }, [state]);

  return (
    <form action={action} className="max-w-md space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" value={email} disabled className="opacity-70" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" defaultValue={defaultName} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultPhone}
          placeholder="+212 6 00 00 00 00"
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="rounded-full">
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
