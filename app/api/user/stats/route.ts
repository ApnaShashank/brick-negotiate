import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User, Negotiation } from "@/models/schemas";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalGames = await Negotiation.countDocuments({ userId: user._id });
    
    return NextResponse.json({
      bestPrice: user.bestPrice,
      bestRounds: user.bestRounds,
      totalGames: totalGames,
      studs: user.studs || 0,
      inventory: user.inventory || [],
      achievements: user.achievements || [],
      hasSeenGuide: user.hasSeenGuide || false,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error("User Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 });
  }
}
