"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, BookOpen } from "lucide-react";
import FlashcardViewer from "./FlashcardViewer"; 

interface FlashcardManagerProps {
  fileId: string;
}

export default function FlashcardManager({ fileId }: FlashcardManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  const generateFlashcards = async () => {
    // If we already have cards, just open the dialog
    if (flashcards.length > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        body: JSON.stringify({ fileId }),
      });
      
      const data = await response.json();
      setFlashcards(data.flashcards || []);
    } catch (error) {
      console.error("Failed to generate flashcards", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={generateFlashcards} 
          variant="outline" 
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Study Flashcards
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Study Flashcards</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-zinc-500">Generating questions from your document...</p>
          </div>
        ) : (
          <div className="flex justify-center py-4">
             {/* FIXED: Passed the required onClose prop */}
             {flashcards.length > 0 ? (
               <FlashcardViewer 
                  flashcards={flashcards} 
                  onClose={() => setIsOpen(false)} 
               />
             ) : (
               <p className="text-zinc-500">No flashcards generated yet.</p>
             )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}