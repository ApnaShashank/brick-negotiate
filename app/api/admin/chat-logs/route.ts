import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { Negotiation } from "@/models/schemas";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== "admin@bricknegotiate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "userId query param required" }, { status: 400 });
    }

    await dbConnect();
    const negotiations = await Negotiation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(negotiations);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch chat logs" }, { status: 500 });
  }
}
