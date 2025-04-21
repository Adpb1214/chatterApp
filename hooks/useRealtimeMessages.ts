import { useEffect } from "react";
import { createClient} from "@supabase/supabase-js";

// Replace these with your Supabase URL and Key
const supabase = createClient(
  "https://wyleespbgsicnxcnpknp.supabase.co",
  "your-public-anon-key"
);

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

const useRealTimeMessages = (
  userId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  useEffect(() => {
    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          // Type assertion to specify that payload.new matches the Message type
          const newMessage = payload.new as Message;

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    // Cleanup the subscription on unmount
    return () => {
      channel.unsubscribe(); // Correct cleanup
    };
  }, [userId, setMessages]);
};

export default useRealTimeMessages;
