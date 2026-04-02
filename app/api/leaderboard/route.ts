import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User, Negotiation } from "@/models/schemas";

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch top 50 users sorted by bestPrice (lowest is better)
    const users = await User.find({ 
      email: { $ne: 'admin@bricknegotiate' }
    })
      .sort({ bestPrice: 1 })
      .limit(50)
      .select('name email bestPrice bestRounds inventory');

    // Get deal counts for all users in one query
    const userIds = users.map(u => u._id);
    const dealCounts = await Negotiation.aggregate([
      { $match: { userId: { $in: userIds }, status: 'accepted' } },
      { $group: { _id: '$userId', count: { $sum: 1 }, lastProduct: { $last: '$productName' } } }
    ]);
    
    const dealMap = new Map(dealCounts.map(d => [d._id.toString(), { count: d.count, lastProduct: d.lastProduct }]));

    const formattedLeaderboard = users.map(user => {
      const deals = dealMap.get(user._id.toString());
      // Get most bought product from inventory
      const productCounts: Record<string, number> = {};
      (user.inventory || []).forEach((item: any) => {
        const name = item.productName || item.productId;
        productCounts[name] = (productCounts[name] || 0) + 1;
      });
      const favoriteProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      return {
        id: user._id.toString(),
        name: user.name || "Anonymous Architect",
        email: user.email,
        price: user.bestPrice,
        rounds: user.bestRounds,
        dealCount: deals?.count || 0,
        lastProduct: deals?.lastProduct || null,
        favoriteProduct,
        inventoryCount: user.inventory?.length || 0,
      };
    });

    return NextResponse.json(formattedLeaderboard);
  } catch (error: any) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard", details: error.message }, { status: 500 });
  }
}
