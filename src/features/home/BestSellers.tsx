"use client";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import type { ProductCardProps } from "@/type/product-type";

export default function BestSellers() {
  const [items, setItems] = useState<ProductCardProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/best-sellers", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => alive && setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => alive && setError("Failed to load"));
    return () => {
      alive = false;
    };
  }, []);

  const sixItems = useMemo(() => (items ?? []).slice(0, 6), [items]);

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
          <Typography variant="body1" color="text.secondary">
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

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
        }}
      >
        {items === null ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={240} />
          ))
        ) : error ? (
          <Typography color="error">Failed to load</Typography>
        ) : (
          sixItems.map((it, i) => <ProductCard key={i} {...it} />)
        )}
      </Box>
    </Container>
  );
}
