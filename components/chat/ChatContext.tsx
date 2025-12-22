"use client";

import { ReactNode, createContext, useState } from "react";
//import { useToast } from "../ui/use-toast"; // We might need to fix this import if you don't have toast yet
import { useMutation ,useQueryClient} from "@tanstack/react-query";
import axios from "axios";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  fileId: string;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
  fileId: "",
});

interface Props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient(); 
  // Define the "Send" function
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await axios.post("/api/message", {
        fileId,
        message,
      });
      return response.data;
    },
    onMutate: () => {
      setMessage(""); // Clear input immediately
      setIsLoading(true);
    },
    onSuccess: async () => {
        setIsLoading(false);

        // THIS IS THE MAGIC LINE: It tells React to re-fetch the messages
        await queryClient.invalidateQueries({ queryKey: ["messages"] }); 
        },
    onError: () => {
       setIsLoading(false);
       console.error("Failed to send message");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
        fileId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};