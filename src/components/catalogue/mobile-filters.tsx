"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiltersPanel, type CategoryOption } from "@/components/catalogue/filters-panel";

export function MobileFilters({ categories }: { categories: CategoryOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="rounded-full lg:hidden" />
        }
      >
        <SlidersHorizontal className="size-4" />
        Filtres
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto bg-ivory">
        <SheetHeader>
          <SheetTitle className="text-left font-heading text-xl">
            Filtres
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-8">
          <FiltersPanel categories={categories} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
