"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Loader2, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    uploadStatus: string;
    createdAt: Date;
    url: string;
  };
  messageCount: number;
}

export default function FileCard({ file, messageCount }: FileCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/files/${file.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("File deleted");
      router.refresh();
    } catch {
      toast.error("Delete failed");
      setIsDeleting(false);
    }
  };

  const isReady = file.uploadStatus === "SUCCESS";
  const isProcessing = file.uploadStatus === "PROCESSING";

  return (
    <Card className="group p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
      
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
          <FileText className="h-5 w-5 text-gray-700 group-hover:text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {file.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(file.createdAt), "MMM d, h:mm a")}</span>
          </div>
        </div>

        {/* Status */}
        {isReady && (
          <div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
            Ready
          </div>
        )}
        {isProcessing && (
          <div className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
        <MessageCircle className="h-4 w-4" />
        <span>{messageCount} messages</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => router.push(`/dashboard/${file.id}`)}
          disabled={!isReady}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
          size="sm"
        >
          {isReady ? "Open Chat" : "Processing..."}
        </Button>
        
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="outline"
          size="sm"
          className="border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}