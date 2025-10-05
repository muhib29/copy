import { NextResponse } from "next/server";
import { categorySchema, readDb, writeDb } from "../_db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const db = await readDb();
  if (
    db.categories.some(
      (c) => c.id === parsed.data.id || c.slug === parsed.data.slug,
    )
  ) {
    return NextResponse.json({ message: "id/slug exists" }, { status: 409 });
  }
  db.categories.push(parsed.data);
  await writeDb(db);
  return NextResponse.json(parsed.data, { status: 201 });
}
