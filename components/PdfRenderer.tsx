"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import FlashcardManager from "./FlashcardManager";

interface PdfRendererProps {
  url: string;
  fileId: string; // <--- 1. Added missing prop
}

export default function PdfRenderer({ url, fileId }: PdfRendererProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full bg-white rounded-md shadow flex flex-col">
      
      {/* --- TOP BAR --- */}
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-4">
        
        {/* Left: Title */}
        <h3 className="text-sm font-medium text-zinc-700">PDF Document</h3>
        
        {/* Right: Buttons */}
        <div className="flex items-center gap-2">
            {/* 2. Added Flashcard Button Here */}
            <FlashcardManager fileId={fileId} />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(url, '_blank')}
            >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
            </Button>
        </div>
      </div>

      {/* --- PDF VIEWER --- */}
      <div className="flex-1 relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        )}
        
        <iframe
          src={`${url}#view=FitH`}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title="PDF Viewer"
        />
      </div>

    </div>
  );
}