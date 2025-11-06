"use client";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";

export type CommentCardProps = {
  content: string;
  author: string;
  avatar?: string;
};

export default function CommentCard({
  content,
  author,
  avatar,
}: CommentCardProps) {
  return (
    <Card elevation={1} sx={{ borderRadius: 3, height: 150, padding: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          “{content}”
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar src={avatar} alt={author} />
          <Typography fontWeight={700}>{author}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
