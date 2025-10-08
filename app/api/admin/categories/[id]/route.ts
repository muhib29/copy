import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { categorySchema, getDb } from "../../_db";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = categorySchema.safeParse({ ...body, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }

  const db = await getDb();
  const res = await db
    .collection("categories")
    .findOneAndUpdate({ id: params.id }, { $set: parsed.data }, { returnDocument: "after" });
  if (!res.value) return NextResponse.json({ message: "not found" }, { status: 404 });
  return NextResponse.json(res.value);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  // Find category to cascade delete products by slug
  const category = await db.collection("categories").findOne({ id: params.id });
  await db.collection("categories").deleteOne({ id: params.id });
  if (category?.slug) {
    await db.collection("products").deleteMany({ category: category.slug });
  }
  return new NextResponse(null, { status: 204 });
}
