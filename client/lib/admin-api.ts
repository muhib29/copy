import { CategoryDTO, CollectionDTO, ProductDTO } from "@shared/api";

const BASE = "/api/admin";

async function http<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const AdminAPI = {
  // Collections
  listCollections: () => http<CollectionDTO[]>("/collections"),
  createCollection: (data: CollectionDTO) =>
    http<CollectionDTO>("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCollection: (id: string, data: Omit<CollectionDTO, "id">) =>
    http<CollectionDTO>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCollection: (id: string) =>
    fetch(`${BASE}/collections/${id}`, { method: "DELETE" }),
  // Categories
  listCategories: () => http<CategoryDTO[]>("/categories"),
  createCategory: (data: CategoryDTO) =>
    http<CategoryDTO>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: Omit<CategoryDTO, "id">) =>
    http<CategoryDTO>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    fetch(`${BASE}/categories/${id}`, { method: "DELETE" }),
  // Products
  listProducts: () => http<ProductDTO[]>("/products"),
  createProduct: (data: ProductDTO) =>
    http<ProductDTO>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: Omit<ProductDTO, "id">) =>
    http<ProductDTO>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    fetch(`${BASE}/products/${id}`, { method: "DELETE" }),
};
