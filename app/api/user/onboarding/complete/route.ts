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
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { hasSeenGuide: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Onboarding Complete API Error:", error);
    return NextResponse.json({ error: "Failed to update onboarding status", details: error.message }, { status: 500 });
  }
}
