import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/schemas";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await dbConnect();

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('name email studs bestPrice inventory createdAt loginCount lastLoginAt streak isBanned');

    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.name || "Anonymous",
      email: u.email,
      studs: u.studs || 0,
      bestPrice: u.bestPrice === 999999 ? "N/A" : `$${u.bestPrice.toFixed(0)}`,
      inventoryCount: u.inventory?.length || 0,
      inventoryItems: (u.inventory || []).map((item: any) => ({
        productName: item.productName || item.productId,
        purchasePrice: item.purchasePrice,
        seller: item.sellerPersonality || 'Unknown',
        date: item.acquiredAt ? new Date(item.acquiredAt).toLocaleDateString() : 'N/A'
      })),
      joinedAt: new Date(u.createdAt).toLocaleDateString(),
      rawJoinedAt: u.createdAt,
      loginCount: u.loginCount || 0,
      lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never',
      streak: u.streak || 0,
      isBanned: u.isBanned || false,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ error: "Failed to fetch user registry" }, { status: 500 });
  }
}
