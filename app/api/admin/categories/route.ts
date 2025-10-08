// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { categorySchema, getDb } from "../_db";

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const items = await db
    .collection("categories")
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
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }

  const db = await getDb();

  const [idExists, slugExists] = await Promise.all([
    db.collection("categories").findOne({ id: parsed.data.id }),
    db.collection("categories").findOne({ slug: parsed.data.slug }),
  ]);
  if (idExists || slugExists) {
    return NextResponse.json({ message: "id or slug exists" }, { status: 409 });
  }

  await db.collection("categories").insertOne(parsed.data);
  return NextResponse.json(parsed.data, { status: 201 });
}
