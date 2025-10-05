"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductCard";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const matchedCategory = categories.find((item) => item.slug === params.slug);

  if (!matchedCategory) {
    notFound();
  }

  const category = matchedCategory;
  const categoryProducts = products.filter(
    (product) => product.category === category.slug,
  );

  return (
    <div className="container py-10">
      <div className="mb-6">
        <p className="text-xs tracking-widest text-accent">
          Ladies Unstitched • {category.collection}
        </p>
        <h1 className="font-display text-3xl md:text-4xl">{category.name}</h1>
        <div className="mt-3 flex gap-2 text-sm">
          <Link
            href={`/collection/${category.collection.toLowerCase()}`}
            className="underline"
          >
            Back to {category.collection}
          </Link>
        </div>
      </div>
      <ProductGrid items={categoryProducts} />
    </div>
  );
}
