"use client";
import { Box, Card, CardContent, Stack, Typography, Chip } from "@mui/material";

export type ProductCardProps = {
  image: string;
  title: string;
  subtitle?: string;
  price: string;
  oldPrice?: string;
  discount?: string; // "50%"
};

export default function ProductCard({
  image,
  title,
  subtitle,
  price,
  oldPrice,
  discount,
}: ProductCardProps) {
  return (
    <Card elevation={1} sx={{ borderRadius: 3 }}>
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "100%",
          height: 120,
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <CardContent sx={{ pt: 1.5 }}>
        <Stack spacing={0.75}>
          <Typography fontWeight={700} lineHeight={1.2}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontWeight={800}>{price}</Typography>
            {oldPrice && (
              <Typography
                variant="body2"
                color="text.disabled"
                sx={{ textDecoration: "line-through" }}
              >
                {oldPrice}
              </Typography>
            )}
            {discount && (
              <Chip
                size="small"
                color="error"
                label={discount}
                sx={{ ml: "auto" }}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
