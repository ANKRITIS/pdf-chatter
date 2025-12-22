"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns"; // Standard date formatting

interface Message {
  id: string;
  text: string;
  isUserMessage: boolean;
  createdAt: string;
}

const Messages = () => {
  const { fileId, isLoading: isAiThinking } = useContext(ChatContext);

  // 1. Fetch messages automatically
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["messages", fileId],
    queryFn: async () => {
      const res = await axios.get(`/api/messages?fileId=${fileId}`);
      return res.data;
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-center h-full py-10">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      </div>
    );
  }

  // Empty State (No messages yet)
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10">
        <MessageSquare className="h-8 w-8 text-blue-500" />
        <h3 className="font-semibold text-xl">You're all set!</h3>
        <p className="text-zinc-500 text-sm">
          Ask your first question to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      
      {/* 2. Map through messages and display them */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-end ${
            message.isUserMessage ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`relative flex h-8 w-8 aspect-square items-center justify-center overflow-hidden rounded-full ${
              message.isUserMessage ? "bg-blue-600 order-2 ml-2" : "bg-zinc-800 order-1 mr-2"
            }`}
          >
             {/* Simple Avatar Icons */}
             {message.isUserMessage ? (
                <span className="text-white text-xs font-bold">You</span>
             ) : (
                <span className="text-white text-xs font-bold">AI</span>
             )}
          </div>

          <div
            className={`flex flex-col space-y-2 text-base max-w-md mx-2 ${
              message.isUserMessage ? "order-1 items-end" : "order-2 items-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg inline-block ${
                message.isUserMessage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {message.text}
            </div>
          </div>
        </div>
      ))}

      {/* 3. Show a loading bubble if AI is thinking */}
      {isAiThinking && (
         <div className="flex items-end justify-start">
            <div className="relative flex h-8 w-8 aspect-square items-center justify-center overflow-hidden rounded-full bg-zinc-800 mr-2">
               <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="px-4 py-2 rounded-lg inline-block bg-gray-200 text-gray-900">
               <Loader2 className="h-4 w-4 animate-spin" />
            </div>
         </div>
      )}
    </div>
  );
};

export default Messages;