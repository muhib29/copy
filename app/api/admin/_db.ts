import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import type { CategoryDTO, CollectionDTO, ProductDTO } from "@shared/api";

const dbPath = path.resolve(process.cwd(), "app/data/db.json");

export async function readDb() {
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as {
    collections: CollectionDTO[];
    categories: CategoryDTO[];
    products: ProductDTO[];
  };
}

export async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8");
}

export const collectionSchema = z.object({
  id: z.string(),
  name: z.enum(["Summer", "Winter"]),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  collection: z.enum(["Summer", "Winter"]),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().url(),
  collection: z.enum(["Summer", "Winter"]),
  category: z.string().min(1),
});
