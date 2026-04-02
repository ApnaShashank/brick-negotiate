import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Product } from "@/models/schemas";

// GET: Fetch all products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Add new product (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, marketValue, hardMinimum, image, difficulty, isLimitedDrop, expiresAt } = body;

    if (!name || !marketValue || !hardMinimum) {
      return NextResponse.json({ error: "Name, marketValue, and hardMinimum are required" }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.create({
      name,
      description: description || '',
      marketValue,
      hardMinimum,
      image: image || '',
      difficulty: difficulty || 'Medium',
      isLimitedDrop: isLimitedDrop || false,
      expiresAt: expiresAt || null,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 });
  }
}

// PATCH: Update existing product
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { productId, ...updates } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE: Soft-delete product (set isActive: false)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await dbConnect();
    await Product.findByIdAndUpdate(productId, { isActive: false });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
