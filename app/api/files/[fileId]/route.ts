import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { pinecone } from "@/lib/pinecone";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileId } = await params;

    // Verify file belongs to user
    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Delete from Pinecone
    try {
      const index = pinecone.Index("studdy-buddy");
      await index.namespace(fileId).deleteAll();
      console.log("✅ Deleted from Pinecone");
    } catch (error) {
      console.error("❌ Failed to delete from Pinecone:", error);
      // Continue anyway - we still want to delete from DB
    }

    // Delete messages first (due to foreign key constraint)
    await db.message.deleteMany({
      where: { fileId },
    });

    // Delete file
    await db.file.delete({
      where: { id: fileId },
    });

    console.log("✅ File deleted successfully");

    return new NextResponse("File deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}