import { NextResponse } from "next/server";
import { productSchema, readDb, writeDb } from "../../_db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = productSchema.safeParse({ ...body, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const db = await readDb();
  const idx = db.products.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "not found" }, { status: 404 });
  db.products[idx] = parsed.data;
  await writeDb(db);
  return NextResponse.json(parsed.data);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const db = await readDb();
  db.products = db.products.filter((p) => p.id !== params.id);
  await writeDb(db);
  return new NextResponse(null, { status: 204 });
}
