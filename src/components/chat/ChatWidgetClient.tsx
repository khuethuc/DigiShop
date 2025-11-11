"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Fab,
  Paper,
  IconButton,
  TextField,
  List,
  ListItem,
  Avatar,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { X, Send } from "lucide-react";
import Image from "next/image";

type Message = { id: string; role: "user" | "assistant"; text: string; time: string };

export default function ChatWidgetClient() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: "m-1",
        role: "assistant",
        text: "Hi 👋 — I'm DigiShop Assistant. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const botText = data?.answer || "Sorry, I couldn’t get an answer right now.";
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: "assistant",
          text: botText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("chat send error", err);
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", text: "⚠️ Error contacting chat service.", time: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen((s) => !s)}
        sx={{ position: "fixed", right: 24, bottom: 24, zIndex: 1400 }}
      >
        <img src="/happy.png" alt="Chatbot" width={45} height={45} />
      </Fab>

      {open && (
        <Paper
          elevation={10}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 90,
            width: { xs: 320, sm: 400 },
            height: 520,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", p: 1.5, bgcolor: "#004AAD", color: "white" }}>
            <Avatar src="/happy.png" alt="Bot" sx={{ bgcolor: "white", mr: 1 }}>
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>DigiShop Support</Typography>
              <Typography fontSize={12} color="rgba(255,255,255,0.8)">
                Online
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <X />
            </IconButton>
          </Box>

          {/* Chat List */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f9fafb" }}>
            {messages.map((m) => (
              <ListItem
                key={m.id}
                sx={{
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  display: "flex",
                  mb: 1,
                }}
              >
                {m.role === "assistant" && (
                  <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                    <Image src="/happy.png" alt="Bot" width={28} height={28} />
                  </Avatar>
                )}

                <Box
                  sx={{
                    bgcolor: m.role === "user" ? "#004AAD" : "#e5e7eb",
                    color: m.role === "user" ? "white" : "black",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.3,
                      textAlign: m.role === "user" ? "right" : "left",
                      color: m.role === "user" ? "rgba(255,255,255,0.7)" : "gray",
                    }}
                  >
                    {m.time}
                  </Typography>
                </Box>
              </ListItem>
            ))}

            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", color: "gray", ml: 1 }}>
                <CircularProgress size={16} sx={{ mr: 1 }} /> <Typography>Typing...</Typography>
              </Box>
            )}
            <div ref={listEndRef} />
          </Box>

          <Divider />

          {/* Input Box */}
          <Box sx={{ p: 1.5, display: "flex", gap: 1 }}>
            <TextField
              placeholder="Type your message..."
              size="small"
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) send();
                }
              }}
            />
            <IconButton color="primary" disabled={loading} onClick={send}>
              <Send />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}
