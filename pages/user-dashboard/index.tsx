"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/Supabase";
import { useSession } from "@/hooks/useSession";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Fetch messages for the logged-in user's thread
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
  }, [userId]);

  // ✅ Send a message
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
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(), // local-only ID for now
          sender_id: userId,
          user_id: userId,
          content,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } else {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" p={2}>
      <Typography variant="h6" gutterBottom>
        Chat with Support Agent
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Messages Display */}
      <Box flex={1} overflow="auto" mb={2}>
        {messages.length === 0 ? (
          <Typography color="text.secondary">No messages</Typography>
        ) : (
          messages.map((msg) => (
            <Typography
              key={msg.id}
              align={msg.sender_id === userId ? "right" : "left"}
              sx={{
                mb: 1,
                backgroundColor:
                  msg.sender_id === userId ? "#e3f2fd" : "#f3e5f5",
                p: 1,
                borderRadius: 2,
                display: "inline-block",
                maxWidth: "75%",
              }}
            >
              {msg.content}
            </Typography>
          ))
        )}
      </Box>

      {/* Message Input */}
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Type your message..."
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
