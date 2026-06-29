import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { categoryRepository } from "@/repositories/category.repository";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await categoryRepository.findAll();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-chocolate"
      >
        <ArrowLeft className="size-4" />
        Retour aux produits
      </Link>
      <h1 className="font-heading text-3xl text-chocolate">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
