import { categoryRepository } from "@/repositories/category.repository";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() {
  const categories = await categoryRepository.findAllWithCount();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-3xl text-chocolate">Catégories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organisez votre catalogue. Une catégorie contenant des produits ne peut pas être supprimée.
        </p>
      </header>
      <CategoryManager categories={categories} />
    </div>
  );
}
