import { MongoClient, ServerApiVersion } from "mongodb";
import { z } from "zod";

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

let cachedClient: MongoClient | null = null;

export async function getDb() {
  const uri = process.env.MONGODB_URI!;
  const dbName = process.env.MONGODB_DB || "nextmerce";

  if (!uri) {
    throw new Error("❌ MONGODB_URI is not set in environment variables");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await cachedClient.connect();
    console.log("[v0] ✅ Connected to MongoDB");

    const db = cachedClient.db(dbName);

    await Promise.all([
      db.collection("collections").createIndex({ id: 1 }, { unique: true }),
      db.collection("categories").createIndex({ id: 1 }, { unique: true }),
      db.collection("categories").createIndex({ slug: 1 }, { unique: true }),
      db.collection("products").createIndex({ id: 1 }, { unique: true }),
      db.collection("products").createIndex({ category: 1 }),
      db.collection("products").createIndex({ collection: 1 }),
    ]);
  }

  return cachedClient.db(dbName);
}
