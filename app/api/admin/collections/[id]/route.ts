import { NextResponse } from "next/server";
import { collectionSchema, readDb, writeDb } from "../../_db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = collectionSchema.safeParse({ ...body, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const db = await readDb();
  const idx = db.collections.findIndex((c) => c.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "not found" }, { status: 404 });
  db.collections[idx] = parsed.data;
  await writeDb(db);
  return NextResponse.json(parsed.data);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const db = await readDb();
  db.collections = db.collections.filter((c) => c.id !== params.id);
  db.categories = db.categories.filter(
    (c) => c.collection !== (params.id.toLowerCase() === "summer" ? "Summer" : "Winter"),
  );
  db.products = db.products.filter(
    (p) => p.collection !== (params.id.toLowerCase() === "summer" ? "Summer" : "Winter"),
  );
  await writeDb(db);
  return new NextResponse(null, { status: 204 });
}
