"use client";

import { ProductGrid } from "@/components/store/ProductCard";

export default function ShopPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl">Shop</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ladies Unstitched • Browse Summer and Winter picks.
          </p>
        </div>
      </div>
      <ProductGrid />
    </div>
  );
}
