import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User, Negotiation } from "@/models/schemas";
import { PRODUCTS } from "@/lib/game-data";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, productName, finalPrice, rounds, status, personality, history } = await req.json();

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const product = PRODUCTS.find(p => p.id === productId);
    const resolvedProductName = productName || product?.name || productId;

    // Create Negotiation Log with full chat history
    const negotiation = await Negotiation.create({
      userId: user._id,
      productId,
      productName: resolvedProductName,
      personality: personality?.id || 'standard',
      personalityName: personality?.name || '',
      finalPrice,
      rounds,
      status,
      history: (history || []).map((msg: any, i: number) => ({
        round: Math.floor(i / 2) + 1,
        offer: msg.bid || 0,
        bid: msg.bid || 0,
        sentiment: msg.sentiment || '',
        speaker: msg.speaker || 'player',
        text: msg.text || '',
      }))
    });

    if (status === 'accepted') {
      const marketValue = product?.marketValue || finalPrice;
      // Calculate Studs Reward: (Saving * 5) + Completion Bonus
      const savings = Math.max(0, marketValue - finalPrice);
      const reward = Math.floor(savings * 5) + 100;

      // Update User
      user.studs = (user.studs || 0) + reward;
      
      // Add to inventory with product name and seller info
      user.inventory.push({
        productId,
        productName: resolvedProductName,
        purchasePrice: finalPrice,
        sellerPersonality: personality?.name || '',
        acquiredAt: new Date()
      });

      // Update Best Price (track globally across all products)
      if (finalPrice < user.bestPrice) {
        user.bestPrice = finalPrice;
        user.bestRounds = rounds;
      }

      await user.save();
    }

    return NextResponse.json({ 
      success: true, 
      negotiationId: negotiation._id 
    });
  } catch (error) {
    console.error("Negotiation Completion Error:", error);
    return NextResponse.json({ error: "Failed to complete negotiation" }, { status: 500 });
  }
}
