"use client";

import { Stack, Card, CardContent, Typography, Avatar } from "@mui/material";

interface CommentCardProps {
  width?: string | number;
  user: string;
  content: string;
  time: string;
}

export default function CommentCard({
  width = "100%",
  user,
  content,
  time,
}: CommentCardProps) {
  // Generate random avatar URL using DiceBear (based on username)
  const avatarUrl = `https://avatar.iran.liara.run/public/boy`;

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      {/* Avatar */}
      <Avatar
        src={avatarUrl}
        alt={user}
        sx={{ width: 48, height: 48, bgcolor: "grey.200" }}
      />

      {/* Comment Card */}
      <Card
        sx={{
          width,
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
          p: 1,
        }}
      >
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          {/* Username */}
          <Typography variant="subtitle1" fontWeight={600}>
            {user}
          </Typography>

          {/* Comment text */}
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {content}
          </Typography>

          {/* Time */}
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mt: 1 }}
          >
            {time}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
