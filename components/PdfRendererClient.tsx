"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useResizeDetector } from "react-resize-detector";
import { useToast } from "@/hooks/use-toast";

// Worker setup - use new worker syntax
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
}

interface PdfRendererProps {
  url: string;
}

export default function PdfRenderer({ url }: PdfRendererProps) {
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const [pageInputValue, setPageInputValue] = useState<string>("1");
  
  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  const isLoading = renderedScale !== scale;

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInputValue(value);
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInputValue);
    
    if (pageNum > 0 && pageNum <= (numPages || 1)) {
      setCurrPage(pageNum);
    } else {
      setPageInputValue(String(currPage));
      toast({
        title: "Invalid page number",
        description: `Please enter a number between 1 and ${numPages}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      
      {/* TOP BAR: CONTROLS */}
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2 gap-2">
        
        {/* Page Navigation */}
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            onClick={() => {
              const newPage = currPage - 1;
              setCurrPage(newPage);
              setPageInputValue(String(newPage));
            }}
            variant="ghost"
            size="sm"
            aria-label="previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-1.5">
            <Input 
              className="w-12 h-8 text-center" 
              value={pageInputValue}
              onChange={handlePageChange}
              onBlur={() => setPageInputValue(String(currPage))}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "..."}</span>
            </p>
          </form>

          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={() => {
              const newPage = currPage + 1;
              setCurrPage(newPage);
              setPageInputValue(String(newPage));
            }}
            variant="ghost"
            size="sm"
            aria-label="next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            disabled={scale <= 0.5}
            onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
            variant="ghost"
            size="sm"
            aria-label="zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm text-zinc-700 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button
            disabled={scale >= 2}
            onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}
            variant="ghost"
            size="sm"
            aria-label="zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            variant="ghost"
            size="sm"
            aria-label="rotate 90 degrees">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF VIEW AREA */}
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref} className="flex justify-center">
            <Document
              file={url}
              className="max-h-full"
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={(error) => {
                toast({
                  title: "Error loading PDF",
                  description: error.message,
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}>
              
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}

              <Page
                className={isLoading ? "hidden" : ""}
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
              
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}