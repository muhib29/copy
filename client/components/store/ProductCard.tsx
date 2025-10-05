"use client";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { products, type Product } from "@/data/products";
import { useCart } from "@/store/cart";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <div className="group">
      <Link href={`/shop`} className="block">
        <div className="overflow-hidden rounded-md bg-muted/30">
          <AspectRatio ratio={4 / 5}>
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </AspectRatio>
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            addItem(
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              },
              1,
            )
          }
          className="rounded-full"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export function ProductGrid({ items = products }: { items?: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
