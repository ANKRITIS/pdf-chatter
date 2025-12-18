"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, MessageSquare, MoreVertical, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("File deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = () => {
    switch (file.uploadStatus) {
      case "SUCCESS":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Ready
          </span>
        );
      case "PROCESSING":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </span>
        );
      case "FAILED":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
                {file.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {format(new Date(file.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/${file.id}`)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{messageCount} messages</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <Button
          onClick={() => router.push(`/dashboard/${file.id}`)}
          className="w-full mt-3"
          variant="outline"
          size="sm"
          disabled={file.uploadStatus !== "SUCCESS"}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {file.uploadStatus === "SUCCESS" ? "Open Chat" : "Processing..."}
        </Button>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{file.name}"? This will also delete all
              associated messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}