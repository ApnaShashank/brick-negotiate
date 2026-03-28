import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/schemas";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Strict restriction to admin@bricknegotiate
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await dbConnect();

    // Fetch all users with relevant stats for admin registry
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('name email studs bestPrice inventory createdAt');

    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.name || "Anonymous",
      email: u.email,
      studs: u.studs || 0,
      bestPrice: u.bestPrice === 999999 ? "N/A" : `$${u.bestPrice.toFixed(0)}`,
      inventoryCount: u.inventory?.length || 0,
      joinedAt: new Date(u.createdAt).toLocaleDateString()
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ error: "Failed to fetch user registry" }, { status: 500 });
  }
}
