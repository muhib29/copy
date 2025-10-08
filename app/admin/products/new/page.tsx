"use client";

import { ProductForm } from "@/components/admin/ProductForm";


export default function NewTexture() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Texture</h1>
        <p className="text-muted-foreground">
          Create a new texture for your collection.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}