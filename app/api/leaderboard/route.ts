import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/schemas";

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch top 50 users sorted by bestPrice (lowest is better)
    // We include everyone. Users without deals default to 999999.
    const leaderboard = await User.find({ 
      email: { $ne: 'admin@bricknegotiate' }
    })
      .sort({ bestPrice: 1 })
      .limit(50)
      .select('name email bestPrice bestRounds');

    const formattedLeaderboard = leaderboard.map(user => ({
      id: user._id.toString(),
      name: user.name || "Anonymous Architect",
      email: user.email,
      price: user.bestPrice,
      rounds: user.bestRounds
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error: any) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard", details: error.message }, { status: 500 });
  }
}
