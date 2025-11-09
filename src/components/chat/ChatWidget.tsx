"use client";

import { useState, useRef } from "react";
import { Box, Fab, Paper, IconButton, Stack, TextField, Typography, List, ListItem, Avatar, CircularProgress } from "@mui/material";
import { MessageCircle, X } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: String(Date.now()), role: "user", text: trimmed };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const answer = data.ok ? data.answer : `Error: ${data.error || "unknown"}`;
      const botMsg: Msg = { id: String(Date.now() + 1), role: "assistant", text: answer };
      setMsgs((m) => [...m, botMsg]);
    } catch (err) {
      setMsgs((m) => [...m, { id: String(Date.now() + 2), role: "assistant", text: "Network error" }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 150);
    }
  };

  return (
    <>
      <Box sx={{ position: "fixed", right: 24, bottom: 24, zIndex: 1500 }}>
        <Fab color="primary" onClick={() => setOpen((s) => !s)} aria-label="chat">
          {open ? <X size={20} /> : <MessageCircle size={20} />}
        </Fab>
      </Box>

      {open && (
        <Paper elevation={12} sx={{ position: "fixed", right: 24, bottom: 88, width: 360, height: 480, zIndex: 1500, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 1, borderBottom: (theme) => `1px solid ${theme.palette.divider}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">DigiShop Help</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <X size={16} />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", p: 1 }} ref={listRef}>
            <List>
              {msgs.map((m) => (
                <ListItem key={m.id} sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Avatar sx={{ mr: 1 }}>{m.role === "user" ? "U" : "B"}</Avatar>
                  <Box sx={{ bgcolor: m.role === "user" ? "#e3f2fd" : "#f5f5f5", p: 1.5, borderRadius: 1, maxWidth: "100%" }}>
                    <Typography variant="body2">{m.text}</Typography>
                  </Box>
                </ListItem>
              ))}
              {loading && (
                <ListItem>
                  <Avatar sx={{ mr: 1 }}>B</Avatar>
                  <CircularProgress size={18} />
                </ListItem>
              )}
            </List>
          </Box>

          <Box sx={{ p: 1, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" spacing={1}>
              <TextField value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about orders, products, warranty..." size="small" fullWidth onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }} />
              <IconButton color="primary" onClick={send} disabled={loading}>
                <MessageCircle size={18} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
}
