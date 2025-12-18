import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import PdfRenderer from "@/components/PdfRenderer"; 
import ChatWrapper from "@/components/chat/ChatWrapper";

interface PageProps {
  params: Promise<{
    fileId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await auth();
  
  if (!userId) redirect("/sign-in");

  // Await params for Next.js 15+
  const { fileId } = await params;

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: userId,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        
        {/* Left Side: PDF Viewer */}
<div className="flex-1 xl:flex">
  <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
    {/* PASS THE ID HERE: */}
    <PdfRenderer url={file.url} fileId={file.id} />
  </div>
</div>

        {/* Right Side: Chat Window */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper fileId={file.id} />
        </div>
        
      </div>
    </div>
  );
};

export default Page;