import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User, Negotiation } from "@/models/schemas";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Strict restriction to admin@bricknegotiate
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized access to Command Center restricted." }, { status: 403 });
    }

    await dbConnect();

    // Aggregate Global Stats
    const totalUsers = await User.countDocuments({});
    const totalNegotiations = await Negotiation.countDocuments({});
    
    // Sum all studs in circulation
    const users = await User.find({}, 'studs');
    const totalStudsCirculating = users.reduce((acc, user) => acc + (user.studs || 0), 0);

    // Get recent negotiation yields (last 7 deals)
    const recentNegotiations = await Negotiation.find({})
      .sort({ createdAt: -1 })
      .limit(7)
      .select('finalPrice');

    const yields = recentNegotiations.map(n => n.finalPrice).reverse();

    return NextResponse.json({
      totalUsers,
      totalNegotiations,
      totalStudsCirculating,
      yields,
      adminName: session.user.name || "Head Architect",
      adminEmail: session.user.email
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch global analytics" }, { status: 500 });
  }
}
