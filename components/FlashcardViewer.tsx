"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, RotateCw, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onClose: () => void;
}

export default function FlashcardViewer({ flashcards, onClose }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Handle "Next Card"
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 200); // Wait for flip to reset
  };

  // Handle "Previous Card"
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 < 0 ? flashcards.length - 1 : prev - 1));
    }, 200);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      
      {/* --- PROGRESS BAR --- */}
      <div className="w-full flex justify-between items-center px-2 text-sm text-zinc-500 font-medium">
        <span>Card {currentIndex + 1} of {flashcards.length}</span>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* --- THE 3D CARD --- */}
      <div 
        className="group relative w-full h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={cn(
          "w-full h-full duration-500 transform-style-3d transition-all relative",
          isFlipped ? "rotate-y-180" : ""
        )}>
          
          {/* FRONT OF CARD */}
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg backface-hidden">
            <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">Question</h3>
            <p className="text-xl font-medium text-slate-800 leading-relaxed">
              {flashcards[currentIndex].front}
            </p>
            <p className="absolute bottom-6 text-xs text-zinc-400 animate-pulse">
              Click to flip
            </p>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute w-full h-full bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg rotate-y-180 backface-hidden">
            <h3 className="text-blue-200 text-xs uppercase tracking-widest font-bold mb-4">Answer</h3>
            <p className="text-xl font-medium text-white leading-relaxed">
              {flashcards[currentIndex].back}
            </p>
          </div>

        </div>
      </div>

      {/* --- CONTROLS --- */}
      <div className="flex items-center gap-4 mt-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handlePrev}
          className="rounded-full h-12 w-12 border-zinc-200 hover:bg-zinc-50"
        >
          <ChevronLeft className="h-5 w-5 text-zinc-600" />
        </Button>

        <Button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="gap-2 px-6 rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
        >
          <RotateCw className="h-4 w-4" />
          Flip Card
        </Button>

        <Button 
          variant="outline" 
          size="icon"
          onClick={handleNext}
          className="rounded-full h-12 w-12 border-zinc-200 hover:bg-zinc-50"
        >
          <ChevronRight className="h-5 w-5 text-zinc-600" />
        </Button>
      </div>

    </div>
  );
}