"use client";

import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
        px: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>

      <Button
        component={NextLink}
        href="/"
        variant="contained"
        color="primary"
        sx={{ borderRadius: 9999, px: 4, py: 1 }}
      >
        Go Home
      </Button>
    </Box>
  );
}
