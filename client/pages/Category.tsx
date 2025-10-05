import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductGrid } from "@/components/store/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = categories.find((c) => c.slug === slug);

  if (!cat) {
    return (
      <div className="container py-20">
        <h1 className="font-display text-3xl">Category not found</h1>
        <p className="mt-2 text-muted-foreground">
          Please select a valid category.
        </p>
      </div>
    );
  }

  const items = products.filter((p) => p.category === cat.slug);

  return (
    <div className="container py-10">
      <div className="mb-6">
        <p className="text-xs tracking-widest text-accent">
          Ladies Unstitched • {cat.collection}
        </p>
        <h1 className="font-display text-3xl md:text-4xl">{cat.name}</h1>
        <div className="mt-3 flex gap-2 text-sm">
          <Link
            to={`/collection/${cat.collection.toLowerCase()}`}
            className="underline"
          >
            Back to {cat.collection}
          </Link>
        </div>
      </div>
      <ProductGrid items={items} />
    </div>
  );
}
