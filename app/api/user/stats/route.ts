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

    // Count total games, deals won, deals failed
    const totalGames = await Negotiation.countDocuments({ userId: user._id });
    const totalDeals = await Negotiation.countDocuments({ userId: user._id, status: 'accepted' });
    const totalFailed = await Negotiation.countDocuments({ userId: user._id, status: { $in: ['failed', 'walked_away'] } });

    // Recent negotiations (last 5)
    const recentNegotiations = await Negotiation.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productName personalityName personality finalPrice status rounds createdAt');

    const recentFormatted = recentNegotiations.map(n => ({
      productName: n.productName,
      seller: n.personalityName || n.personality,
      price: n.finalPrice,
      status: n.status,
      rounds: n.rounds,
      date: new Date(n.createdAt).toLocaleDateString()
    }));

    // Win rate
    const winRate = totalGames > 0 ? Math.round((totalDeals / totalGames) * 100) : 0;
    
    return NextResponse.json({
      bestPrice: user.bestPrice,
      bestRounds: user.bestRounds,
      totalGames,
      totalDeals,
      totalFailed,
      winRate,
      studs: user.studs || 0,
      inventory: user.inventory || [],
      achievements: user.achievements || [],
      hasSeenGuide: user.hasSeenGuide || false,
      name: user.name,
      email: user.email,
      streak: user.streak || 0,
      recentNegotiations: recentFormatted,
    });
  } catch (error) {
    console.error("User Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 });
  }
}
