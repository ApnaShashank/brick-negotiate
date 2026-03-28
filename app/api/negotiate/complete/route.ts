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

    const { productId, finalPrice, rounds, status, personality, history } = await req.json();

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

    // Create Negotiation Log
    const negotiation = await Negotiation.create({
      userId: user._id,
      productId,
      productName: product.name,
      personality: personality?.id || 'standard',
      finalPrice,
      rounds,
      status,
      history
    });

    if (status === 'accepted') {
      // Calculate Studs Reward: (Saving * 2) + Completion Bonus
      const savings = Math.max(0, product.marketValue - finalPrice);
      const reward = Math.floor(savings * 5) + 100;

      // Update User
      user.studs = (user.studs || 0) + reward;
      
      // Add to inventory
      user.inventory.push({
        productId,
        purchasePrice: finalPrice,
        acquiredAt: new Date()
      });

      // Update Best Price for this specific product (legacy support for global top price)
      if (productId === 'modular-tower') {
        if (finalPrice < user.bestPrice) {
          user.bestPrice = finalPrice;
          user.bestRounds = rounds;
        }
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
