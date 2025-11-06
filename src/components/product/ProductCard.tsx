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
    <Card elevation={1}
          sx={{
            width: { xs: "90%", sm: "80%", md: 280 },
            borderRadius: 3,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            },
            cursor: "pointer",
        }}>
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "100%",
          height: 150,
          objectFit: "cover",
          borderRadius: 1.5,
        }}
      />
      <CardContent sx={{ pt: 1.5 }}>
        <Stack spacing={2.5}>
          <Typography fontWeight={500} lineHeight={1.2}
                      sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mb: 2,
                          fontSize: { xs: 14, sm: 16, md: 18, lg: 19 },
                        }}
          >
            {title}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontWeight={700}
                        sx={{ fontSize: { xs: 13, sm: 15, md: 17, lg: 18 } }}
            >
              {Number(price.replace(/[^\d]/g, "")).toLocaleString("en-US")} ₫
            </Typography>
            {oldPrice && (
              <Typography
                variant="body1"
                color="text.disabled"
                sx={{ textDecoration: "line-through", fontSize: { xs: 13, sm: 15, md: 17, lg: 18 } }}
              >
              {Number(oldPrice.replace(/[^\d]/g, "")).toLocaleString("en-US")} đ
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
