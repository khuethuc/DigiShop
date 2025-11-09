"use client";
import { Box, Card, CardContent, Stack, Typography, Chip } from "@mui/material";
import type { ProductCardProps } from "@/type/product-type";

export default function ProductCard({
  image,
  title,
  price,
  oldPrice,
  discount,
}: ProductCardProps) {
  return (
    <Card
      elevation={1}
      sx={{
        width: "100%",
        borderRadius: 2.5,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform .25s ease, box-shadow .25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Ảnh ratio 16:9 giữ kích thước ổn định */}
      <Box
        component="img"
        src={image}
        alt={title}
        loading="lazy"
        sx={{
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
          bgcolor: "#f4f6f8",
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          p: { xs: 1.25, md: 1.4 },
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        <Typography
          fontWeight={600}
          sx={{
            fontSize: { xs: 13.5, sm: 15, md: 17.5 },
            lineHeight: 1.3,
            minHeight: { xs: 34, sm: 34 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ flexWrap: "nowrap", minWidth: 0 }}
        >
          <Typography
            fontWeight={700}
            sx={{
              fontSize: { xs: 13.5, sm: 14, md: 14.5 },
              whiteSpace: "nowrap",
              letterSpacing: 0.2,
            }}
          >
            {price.toLocaleString("en-US")}₫
          </Typography>
          {oldPrice && (
            <Typography
              color="text.disabled"
              sx={{
                textDecoration: "line-through",
                fontSize: { xs: 12.5, sm: 13, md: 13 },
                whiteSpace: "nowrap",
              }}
            >
              {oldPrice.toLocaleString("en-US")}đ
            </Typography>
          )}
          {discount && (
            <Chip
              label={discount}
              color="error"
              size="small"
              sx={{
                ml: "auto",
                height: 22,
                fontSize: 12,
                fontWeight: 600,
                px: 0.5,
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
