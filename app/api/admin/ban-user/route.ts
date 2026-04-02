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

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.isBanned = !user.isBanned;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      isBanned: user.isBanned,
      message: user.isBanned ? `${user.name || user.email} has been banned` : `${user.name || user.email} has been unbanned`
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update ban status" }, { status: 500 });
  }
}
