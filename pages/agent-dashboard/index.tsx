// pages/agent-dashboard.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/Supabase";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,

  ListItemButton,
} from "@mui/material";
import { useSession } from "@/hooks/useSession";

interface Profile {
  id: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  user_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const AgentDashboard = () => {
  const { session } = useSession();
  const agentId = session?.user?.id ?? "";

  const [users, setUsers] = useState<Profile[]>([]);
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role")
        .neq("role", "agent");

      if (data) setUsers(data);
      if (error) console.error("Error fetching users:", error);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "agent");

      if (data) {
        const ids = data.map((a) => a.id);
        setAgentIds(ids);
      }
      if (error) console.error("Error fetching agents:", error);
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", selectedUser.id)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      if (error) console.error("Error fetching messages:", error);
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:user:${selectedUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${selectedUser.id}`,
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
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !agentId) return;

    const content = newMessage.trim();

    const { error } = await supabase.from("messages").insert([
      {
        user_id: selectedUser.id,
        sender_id: agentId,
        content,
      },
    ]);

    if (!error) {
      setNewMessage("");
    } else {
      console.error("Failed to send message:", error);
    }
  };

  const isAgentMessage = (senderId: string) => {
    return agentIds.includes(senderId);
  };

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      {/* Sidebar - Fixed User List */}
      <Box
        width="300px"
        borderRight="1px solid #ccc"
        p={2}
        overflow="auto"
      >
        <Typography variant="h6">Users</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton
                selected={selectedUser?.id === user.id}
                onClick={() => setSelectedUser(user)}
              >
                <ListItemText primary={user.email} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Window */}
      <Box flex={1} display="flex" flexDirection="column" height="100%">
        {/* Header */}
        <Box p={2} borderBottom="1px solid #ccc">
          <Typography variant="h6">
            Chat with {selectedUser?.email || "..."}
          </Typography>
        </Box>

        {/* Message List */}
        <Box
          flex={1}
          overflow="auto"
          display="flex"
          flexDirection="column"
          px={2}
          py={1}
        >
          {messages.length === 0 ? (
            <Typography color="text.secondary">No messages</Typography>
          ) : (
            messages.map((msg) => {
              const isAgent = isAgentMessage(msg.sender_id);
              return (
                <Box
                  key={msg.id}
                  alignSelf={isAgent ? "flex-end" : "flex-start"}
                  sx={{
                    backgroundColor: isAgent ? "#e3f2fd" : "#f3e5f5",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                    mb: 1,
                  }}
                >
                  <Typography>{msg.content}</Typography>
                </Box>
              );
            })
          )}
          <div ref={messageEndRef} />
        </Box>

        {/* Input Area */}
        <Box display="flex" gap={1} p={2} borderTop="1px solid #ccc">
          <TextField
            fullWidth
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="contained" onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentDashboard;
