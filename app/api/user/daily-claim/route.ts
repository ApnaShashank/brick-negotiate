import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/schemas";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date();
    const lastClaim = user.lastStreakClaim ? new Date(user.lastStreakClaim) : null;

    // Check if already claimed today
    if (lastClaim) {
      const isSameDay = lastClaim.toDateString() === now.toDateString();
      if (isSameDay) {
        return NextResponse.json({ 
          error: "Already claimed today!", 
          streak: user.streak,
          alreadyClaimed: true 
        }, { status: 400 });
      }
    }

    // Calculate streak
    let newStreak = 1;
    if (lastClaim) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = lastClaim.toDateString() === yesterday.toDateString();
      if (wasYesterday) {
        newStreak = (user.streak || 0) + 1;
      }
    }

    // Bonus scales with streak (50 base + 10 per streak day, max 200)
    const bonus = Math.min(200, 50 + (newStreak - 1) * 10);

    user.streak = newStreak;
    user.lastStreakClaim = now;
    user.studs = (user.studs || 0) + bonus;
    await user.save();

    return NextResponse.json({
      success: true,
      streak: newStreak,
      bonus,
      totalStuds: user.studs
    });
  } catch (error: any) {
    console.error("Daily Claim Error:", error);
    return NextResponse.json({ error: "Failed to claim daily reward" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date();
    const lastClaim = user.lastStreakClaim ? new Date(user.lastStreakClaim) : null;
    const canClaim = !lastClaim || lastClaim.toDateString() !== now.toDateString();

    return NextResponse.json({
      streak: user.streak || 0,
      canClaim,
      lastClaim: user.lastStreakClaim
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to check streak" }, { status: 500 });
  }
}
