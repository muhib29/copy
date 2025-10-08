import { NextResponse } from "next/server";
import { collectionSchema, getDb } from "../_db";

export async function GET() {
  const db = await getDb();
  const items = await db.collection("collections").find().project({ _id: 0 }).toArray();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = collectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const db = await getDb();
  const exists = await db
    .collection("collections")
    .findOne({ id: parsed.data.id });
  if (exists) {
    return NextResponse.json({ message: "id exists" }, { status: 409 });
  }
  await db.collection("collections").insertOne(parsed.data);
  return NextResponse.json(parsed.data, { status: 201 });
}
