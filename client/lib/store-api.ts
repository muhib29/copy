import type { CategoryDTO, CollectionDTO, ProductDTO } from "@shared/api";

const BASE = "/api/admin";

async function http<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const StoreAPI = {
  listProducts: () => http<ProductDTO[]>("/products"),
  listCategories: () => http<CategoryDTO[]>("/categories"),
  listCollections: () => http<CollectionDTO[]>("/collections"),
};


