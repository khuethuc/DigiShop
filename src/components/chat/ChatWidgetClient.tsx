"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Fab, Paper, IconButton, TextField, List, ListItem, ListItemText, Typography } from "@mui/material";

type Message = { id: string; role: "user" | "assistant" | "system"; text: string };

export default function ChatWidgetClient() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setMessages([{ id: "m-1", role: "assistant", text: "Hi — ask me about products, payment, returns or warranty." }]);
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const dedupeAppend = (msg: Message) => {
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].role === msg.role && prev[prev.length - 1].text === msg.text) return prev;
      return [...prev, msg];
    });
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    dedupeAppend(userMsg);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const botText = data?.answer || "Sorry, I couldn't get an answer right now.";
      dedupeAppend({ id: `b-${Date.now()}`, role: "assistant", text: String(botText) });
    } catch (err) {
      console.error("chat send error", err);
      dedupeAppend({ id: `e-${Date.now()}`, role: "assistant", text: "Error contacting chat service." });
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
        size="medium"
      >
        Chat
      </Fab>

      {open && (
        <Paper
          elevation={8}
          sx={{ position: "fixed", right: 24, bottom: 90, width: { xs: 320, sm: 420 }, maxHeight: 560, zIndex: 1400, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ p: 1, borderBottom: "1px solid #eee" }}>
            <Typography variant="subtitle1">DigiShop Support</Typography>
            <Typography variant="caption" color="text.secondary">Ask about products, payments, returns or warranty</Typography>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            <List ref={listRef as any} sx={{ p: 1 }}>
              {messages.map((m) => (
                <ListItem key={m.id} alignItems="flex-start">
                  <ListItemText primary={m.role === "user" ? "You" : "Support"} secondary={m.text} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ p: 1, borderTop: "1px solid #eee", display: "flex", gap: 1 }}>
            <TextField
              placeholder="Type your message..."
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) send();
                }
              }}
              multiline
              minRows={1}
              maxRows={4}
              sx={{ flex: 1 }}
            />
            <IconButton color="primary" disabled={loading} onClick={() => send()}>
              Send
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}
