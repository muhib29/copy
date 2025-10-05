import { NextResponse } from "next/server";
import { productSchema, readDb, writeDb } from "../_db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const db = await readDb();
  if (db.products.some((p) => p.id === parsed.data.id)) {
    return NextResponse.json({ message: "id exists" }, { status: 409 });
  }
  db.products.push(parsed.data);
  await writeDb(db);
  return NextResponse.json(parsed.data, { status: 201 });
}
