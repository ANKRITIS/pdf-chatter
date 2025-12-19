import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) return new NextResponse("File ID required", { status: 400 });

  // Fetch the last 100 messages for this file
  const messages = await db.message.findMany({
    where: {
      fileId,
      userId,
    },
    orderBy: {
      createdAt: "desc", // Newest messages first
    },
    take: 100,
  });

  return NextResponse.json(messages);
};