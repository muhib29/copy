import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductGrid } from "@/components/store/ProductCard";

export default function CollectionPage() {
  const { slug } = useParams();
  const name = (slug || "").toLowerCase();
  const collection =
    name === "summer" ? "Summer" : name === "winter" ? "Winter" : null;
  if (!collection)
    return (
      <div className="container py-20">
        <h1 className="font-display text-3xl">Collection not found</h1>
        <p className="mt-2 text-muted-foreground">
          Please choose Summer or Winter.
        </p>
      </div>
    );

  const cats = categories.filter((c) => c.collection === collection);
  const items = products.filter((p) => p.collection === collection);

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs tracking-widest text-accent">
            Ladies Unstitched
          </p>
          <h1 className="font-display text-3xl md:text-4xl">
            {collection} Collection
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore categories crafted for the season.
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            className="rounded-full border px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ProductGrid items={items} />
    </div>
  );
}
