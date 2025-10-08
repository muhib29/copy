"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { StoreAPI } from "@/lib/store-api";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const productsQ = useQuery({ queryKey: ["products"], queryFn: StoreAPI.listProducts });
  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: StoreAPI.listCategories });
  const matchedCategory = (categoriesQ.data ?? []).find((item) => item.slug === params.slug);

  if (!matchedCategory) {
    notFound();
  }

  const category = matchedCategory;
  const categoryProducts = (productsQ.data ?? []).filter(
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
