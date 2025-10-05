import { NextResponse } from "next/server";
import { categorySchema, readDb, writeDb } from "../../_db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = categorySchema.safeParse({ ...body, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const db = await readDb();
  const idx = db.categories.findIndex((c) => c.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "not found" }, { status: 404 });
  db.categories[idx] = parsed.data;
  await writeDb(db);
  return NextResponse.json(parsed.data);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const db = await readDb();
  db.categories = db.categories.filter((c) => c.id !== params.id);
  db.products = db.products.filter((p) => p.category !== params.id);
  await writeDb(db);
  return new NextResponse(null, { status: 204 });
}
