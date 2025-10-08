import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, productSchema } from "../_db";

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const items = await db
    .collection("products")
    .find()
    .project({ _id: 0 })
    .toArray();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }

  const db = await getDb();
  const exists = await db.collection("products").findOne({ id: parsed.data.id });
  if (exists) {
    return NextResponse.json({ message: "id exists" }, { status: 409 });
  }
  await db.collection("products").insertOne(parsed.data);
  return NextResponse.json(parsed.data, { status: 201 });
}
