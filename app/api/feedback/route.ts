import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Feedback } from "@/models/schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { message, rating, type } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await dbConnect();

    const feedback = await Feedback.create({
      userId: session?.user?.id || null,
      name: session?.user?.name || "Anonymous Player",
      email: session?.user?.email || null,
      message,
      rating,
      type: type || 'other'
    });

    return NextResponse.json({ success: true, feedbackId: feedback._id });
  } catch (error: any) {
    console.error("Feedback API Error:", error);
    return NextResponse.json({ error: "Failed to submit feedback", details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admin can list feedback
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const feedbacks = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}
