import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { CategoryDTO, CollectionDTO, ProductDTO } from "@shared/api";

const dbPath = path.resolve(process.cwd(), "server/data/db.json");

async function readDb() {
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as {
    collections: CollectionDTO[];
    categories: CategoryDTO[];
    products: ProductDTO[];
  };
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8");
}

const collectionSchema = z.object({
  id: z.string(),
  name: z.enum(["Summer", "Winter"]),
});
const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  collection: z.enum(["Summer", "Winter"]),
});
const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().url(),
  collection: z.enum(["Summer", "Winter"]),
  category: z.string().min(1),
});

export const adminRouter = Router();

// Collections
adminRouter.get("/collections", async (_req, res) => {
  const db = await readDb();
  res.json(db.collections);
});
adminRouter.post("/collections", async (req, res) => {
  const parsed = collectionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const db = await readDb();
  if (db.collections.some((c) => c.id === parsed.data.id))
    return res.status(409).json({ message: "id exists" });
  db.collections.push(parsed.data);
  await writeDb(db);
  res.status(201).json(parsed.data);
});
adminRouter.put("/collections/:id", async (req, res) => {
  const parsed = collectionSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const db = await readDb();
  const idx = db.collections.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "not found" });
  db.collections[idx] = parsed.data;
  await writeDb(db);
  res.json(parsed.data);
});
adminRouter.delete("/collections/:id", async (req, res) => {
  const db = await readDb();
  db.collections = db.collections.filter((c) => c.id !== req.params.id);
  // cascade: remove categories/products of this collection
  db.categories = db.categories.filter(
    (c) =>
      c.collection !==
      (req.params.id.toLowerCase() === "summer" ? "Summer" : "Winter"),
  );
  db.products = db.products.filter(
    (p) =>
      p.collection !==
      (req.params.id.toLowerCase() === "summer" ? "Summer" : "Winter"),
  );
  await writeDb(db);
  res.status(204).end();
});

// Categories
adminRouter.get("/categories", async (_req, res) => {
  const db = await readDb();
  res.json(db.categories);
});
adminRouter.post("/categories", async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const db = await readDb();
  if (
    db.categories.some(
      (c) => c.id === parsed.data.id || c.slug === parsed.data.slug,
    )
  )
    return res.status(409).json({ message: "id/slug exists" });
  db.categories.push(parsed.data);
  await writeDb(db);
  res.status(201).json(parsed.data);
});
adminRouter.put("/categories/:id", async (req, res) => {
  const parsed = categorySchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const db = await readDb();
  const idx = db.categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "not found" });
  db.categories[idx] = parsed.data;
  await writeDb(db);
  res.json(parsed.data);
});
adminRouter.delete("/categories/:id", async (req, res) => {
  const db = await readDb();
  db.categories = db.categories.filter((c) => c.id !== req.params.id);
  db.products = db.products.filter((p) => p.category !== req.params.id);
  await writeDb(db);
  res.status(204).end();
});

// Products
adminRouter.get("/products", async (_req, res) => {
  const db = await readDb();
  res.json(db.products);
});
adminRouter.post("/products", async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const db = await readDb();
  if (db.products.some((p) => p.id === parsed.data.id))
    return res.status(409).json({ message: "id exists" });
  db.products.push(parsed.data);
  await writeDb(db);
  res.status(201).json(parsed.data);
});
adminRouter.put("/products/:id", async (req, res) => {
  const parsed = productSchema.safeParse({ ...req.body, id: req.params.id });
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const db = await readDb();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "not found" });
  db.products[idx] = parsed.data;
  await writeDb(db);
  res.json(parsed.data);
});
adminRouter.delete("/products/:id", async (req, res) => {
  const db = await readDb();
  db.products = db.products.filter((p) => p.id !== req.params.id);
  await writeDb(db);
  res.status(204).end();
});
