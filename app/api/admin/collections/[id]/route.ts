import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { collectionSchema, getDb } from "../../_db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = collectionSchema.safeParse({ ...body, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const db = await getDb();
  const res = await db
    .collection("collections")
    .findOneAndUpdate(
      { id: params.id },
      { $set: parsed.data },
      { returnDocument: "after" },
    );
  if (!res.value)
    return NextResponse.json({ message: "not found" }, { status: 404 });
  return NextResponse.json(res.value);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const db = await getDb();
  await db.collection("collections").deleteOne({ id: params.id });
  const name = params.id.toLowerCase() === "summer" ? "Summer" : "Winter";
  await db.collection("categories").deleteMany({ collection: name });
  await db.collection("products").deleteMany({ collection: name });
  return new NextResponse(null, { status: 204 });
}
