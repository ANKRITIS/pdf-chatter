import Link from "next/link";
import { Loader2, MessageSquare, Plus, Ghost } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import FileCard from "./FileCard";

interface FileListProps {
  files: {
    id: string;
    name: string;
    uploadStatus: "PENDING" | "PROCESSING" | "FAILED" | "SUCCESS";
    url: string;
    createdAt: Date;
    key: string;
  }[];
}

export default function FileList({ files }: FileListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file) => (
        <FileCard 
          key={file.id} 
          file={file} 
          messageCount={0} // <--- THIS WAS MISSING!
        />
      ))}
    </div>
  );
}