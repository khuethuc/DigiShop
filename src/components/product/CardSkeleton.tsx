"use client";
import { Card, Box } from "@mui/material";
import { Stack } from "@mui/system";

export default function CardSkeleton() {
 return (
    <Card
      elevation={1}
      sx={{
        width: { xs: "90%", sm: "80%", md: 280 },
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#f0f0f0",
        cursor: "default",
      }}
    >
      {/* 🖼 Image Placeholder */}
      <Box
        sx={{
          width: "100%",
          height: 150,
          bgcolor: "#e0e0e0",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-150px",
            height: "100%",
            width: "150px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            animation: "shimmer 1.5s infinite",
          },
        }}
      />

      <Stack spacing={2} sx={{ p: 2 }}>
        {/* 🧾 Title Placeholder */}
        <Box
          sx={{
            height: 20,
            width: "80%",
            borderRadius: 1,
            bgcolor: "#e0e0e0",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-150px",
              height: "100%",
              width: "150px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              animation: "shimmer 1.5s infinite",
            },
          }}
        />

        {/* 💲 Price Row Placeholder */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              height: 20,
              width: "40%",
              borderRadius: 1,
              bgcolor: "#e0e0e0",
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-150px",
                height: "100%",
                width: "150px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                animation: "shimmer 1.5s infinite",
              },
            }}
          />
          <Box
            sx={{
              height: 20,
              width: "25%",
              borderRadius: 1,
              bgcolor: "#e0e0e0",
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-150px",
                height: "100%",
                width: "150px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                animation: "shimmer 1.5s infinite",
              },
            }}
          />
        </Stack>
      </Stack>

      {/* 🔁 Define shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            left: -150px;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </Card>
  );
}