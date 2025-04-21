"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/Supabase";
import { useSession } from "@/hooks/useSession";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";

interface Message {
  id: string;
  sender_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const UserDashboard = () => {
  const { session } = useSession();
  const userId = session?.user?.id ?? "";
//   const adminEmail = session?.user?.email ?? "admin@example.com"; // Assuming admin's email is available

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false); // For "typing..." animation
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch messages
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      if (error) console.error("Error fetching messages:", error);
    };

    fetchMessages();

    // ✅ Real-time subscription
    const channel = supabase
      .channel(`messages:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ✅ Scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !userId) return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: userId,
        user_id: userId,
        content,
      },
    ]);

    if (!error) {
      setNewMessage("");

      // Simulate chatbot reply after a short delay
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender_id: "chatbot", // Chatbot sender ID (use a different ID)
            user_id: userId,
            content: "Hi there! How can I assist you today?",
            created_at: new Date().toISOString(),
          },
        ]);
      }, 1500); // Simulating "typing..." for 1.5 seconds
    } else {
      console.error("Failed to send message:", error);
    }
  };

  // Get the initials of the admin's email (e.g., "jd" from "john.doe@example.com")
//   const getAdminInitials = (email: string) => {
//     const nameParts = email.split("@")[0].split(".");
//     return nameParts.length > 1
//       ? nameParts[0][0] + nameParts[1][0]
//       : nameParts[0][0];
//   };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Header */}
      <Box p={2} borderBottom="1px solid #ccc">
        <Typography variant="h6">Talk to us, we are listening 👂</Typography>
      </Box>

      {/* Messages */}
      <Box
        flex={1}
        overflow="auto"
        display="flex"
        flexDirection="column"
        px={2}
        py={1}
      >
        {messages.length === 0 ? (
          <Typography color="text.secondary">We are just a message away 💬</Typography>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender_id === userId;
            const isBot = msg.sender_id === "chatbot";
            return (
              <Box
                key={msg.id}
                alignSelf={isUser ? "flex-end" : "flex-start"}
                sx={{
                  backgroundColor: isUser ? "#e3f2fd" : isBot ? "#f3e5f5" : "#e8f5e9",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "75%",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isBot && (
                  <Avatar
                    sx={{ width: 30, height: 30, mr: 1 }}
                    alt="Dil Se Listener"
                    src="/bot-avatar.png" 
                  />
                )}
                <Typography>
                  {isBot
                    ? `${msg.content}`
                    : isUser
                    ? msg.content
                    : `${msg.content}`}
                </Typography>
                {isTyping && isBot && (
                  <Box sx={{ ml: 2 }}>
                    <CircularProgress size={20} color="secondary" />
                  </Box>
                )}
              </Box>
            );
          })
        )}
        <div ref={messageEndRef} />
      </Box>

      {/* Input */}
      <Box display="flex" gap={1} p={2} borderTop="1px solid #ccc">
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default UserDashboard;
