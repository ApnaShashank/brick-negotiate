import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, amount } = await req.json();
    if (!userId || !amount) {
      return NextResponse.json({ error: "userId and amount required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.studs = (user.studs || 0) + Number(amount);
    await user.save();

    return NextResponse.json({ 
      success: true, 
      newBalance: user.studs,
      message: `Granted ${amount} studs to ${user.name || user.email}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to grant studs" }, { status: 500 });
  }
}
