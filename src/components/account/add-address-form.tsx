"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createAddressAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddAddressForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createAddressAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Adresse ajoutée");
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state]);

  if (!open) {
    return (
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="rounded-full"
      >
        <Plus className="size-4" />
        Ajouter une adresse
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-border bg-warm-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="label" label="Libellé (optionnel)" placeholder="Domicile" />
        <Field name="fullName" label="Nom complet" required />
        <Field name="phone" label="Téléphone" required type="tel" />
        <Field name="city" label="Ville" required />
        <div className="sm:col-span-2">
          <Field name="line1" label="Adresse" required />
        </div>
        <div className="sm:col-span-2">
          <Field name="line2" label="Complément (optionnel)" />
        </div>
        <Field name="postalCode" label="Code postal (optionnel)" />
        <Field name="country" label="Pays" defaultValue="Maroc" />
      </div>

      {state.error && (
        <p className="mt-4 text-sm text-destructive">{state.error}</p>
      )}

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? "Ajout…" : "Enregistrer l'adresse"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen(false)}
          className="rounded-full"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  ...props
}: {
  name: string;
  label: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
