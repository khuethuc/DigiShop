"use client";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { useMemo } from "react";
import ProductCard from "../../components/home/ProductCard";

const items = Array.from({ length: 12 }).map((_, k) => ({
  image: "/images/chatgpt-card.png",
  title: `ChatGPT Plus 20$ for 1 Month - #${k + 1}`,
  subtitle: "Instant delivery | Warranty",
  price: "150.000đ",
  oldPrice: "300.000đ",
  discount: "50%",
}));

export default function BestSellers() {
  // Lấy đúng 6 item để hiển thị
  const sixItems = useMemo(() => items.slice(0, 6), []);

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Stack>
          <Typography variant="h6" fontWeight={800}>
            Best Sellers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A selection of trending items you might love.
          </Typography>
        </Stack>

        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 9999, px: 2 }}
        >
          See more →
        </Button>
      </Stack>

      {/* Grid 6 cards: 2 cột (xs), 3 cột (sm+) */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {sixItems.map((it, i) => (
          <ProductCard key={i} {...it} />
        ))}
      </Box>
    </Container>
  );
}
