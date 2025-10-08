"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { StoreAPI } from "@/lib/store-api";

const COLLECTION_LABEL: Record<string, "Summer" | "Winter"> = {
  summer: "Summer",
  winter: "Winter",
};

export default function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const productsQ = useQuery({ queryKey: ["products"], queryFn: StoreAPI.listProducts });
  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: StoreAPI.listCategories });
  const key = params.slug?.toLowerCase();
  const collection = key ? COLLECTION_LABEL[key] : undefined;

  if (!collection) {
    notFound();
  }

  const collectionCategories = (categoriesQ.data ?? []).filter(
    (category) => category.collection === collection,
  );
  const collectionProducts = (productsQ.data ?? []).filter(
    (product) => product.collection === collection,
  );

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
        {collectionCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-full border px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <ProductGrid items={collectionProducts} />
    </div>
  );
}
