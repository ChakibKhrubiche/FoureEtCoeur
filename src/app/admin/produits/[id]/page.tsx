import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { adminRepository } from "@/repositories/admin.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    adminRepository.getProduct(id),
    categoryRepository.findAll(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-chocolate"
      >
        <ArrowLeft className="size-4" />
        Retour aux produits
      </Link>
      <h1 className="font-heading text-3xl text-chocolate">Modifier : {product.name}</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
