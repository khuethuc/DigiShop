"use client";
import { Box, Container, Typography } from "@mui/material";
import { useMemo } from "react";
import KeywordTag from "../../components/home/KeywordTag";

// Mock data
const items = [
  { label: "Work", color: "primary" as const },
  { label: "Study", color: "error" as const },
  { label: "Leisure", color: "warning" as const },
  { label: "AI", color: "info" as const },
  { label: "Youtube", color: "secondary" as const },
  { label: "Netflix", color: "warning" as const },
  { label: "Gaming", color: "success" as const },
  { label: "Tools", color: "default" as const },
];

export default function CommonTags() {
  const six = useMemo(() => items.slice(0, 6), []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5 }}>
        Common Tags
      </Typography>

      <Box
        sx={{
          py: 1.25,
          // Mobile: cuộn ngang 1 hàng
          display: { xs: "grid", md: "grid" },
          gridAutoFlow: { xs: "column" },
          gridAutoColumns: { xs: "max-content" },
          overflowX: { xs: "auto", md: "visible" },
          // Desktop: 6 cột trên một hàng
          gridTemplateColumns: { md: "repeat(6, minmax(0, 1fr))" },
          columnGap: 1.5,
        }}
      >
        {six.map((it, i) => (
          <Box
            key={i}
            sx={{
              // căn giữa tag trong từng ô, giúp nhìn đều nhau ở desktop
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* to + vuông vức (dùng phiên bản KeywordTag đã chỉnh) */}
            <KeywordTag {...it} size="lg" square />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
