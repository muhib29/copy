// app/api/admin/textures/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // all, active, inactive

    // Build query
    const query: any = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const textures = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    // Get statistics
    const stats = {
      total: await Product.countDocuments(),
      active: await Product.countDocuments({ isActive: true }),
      inactive: await Product.countDocuments({ isActive: false }),
      featured: await Product.countDocuments({
        featured: true,
        isActive: true,
      }),
      trending: await Product.countDocuments({
        trending: true,
        isActive: true,
      }),
    };

    return NextResponse.json({
      success: true,
      data: textures,
      stats,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      total,
    });
  } catch (error) {
    console.error("Error fetching admin textures:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch textures" },
      { status: 500 },
    );
  }
}