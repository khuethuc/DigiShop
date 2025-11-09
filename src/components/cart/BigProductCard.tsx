import { Card, CardContent, Box, Typography, IconButton, Stack, Button, Skeleton } from "@mui/material";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { ProductCardProps } from "@/type/product-type";

export default function BigProductCard({
  title,
  image,
  price,
  type,
  oldPrice,
  quantity
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate discount percentage if oldPrice exists
  const discountPercent = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderRadius: 3,
        boxShadow: 2,
        gap: 2,
        alignItems: "center",
        maxWidth: 800
      }}
    >
      {/* LEFT IMAGE */}
      <Box
        sx={{
          minWidth: 220,
          width: 220,
          height: 140,
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover"}}
        />
      </Box>

      {/* CONTENT */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Stack spacing={2}>
          {/* TITLE */}
          {title ? (
            <Typography fontSize={18} fontWeight={600} sx={{ maxWidth: 400 }}>
              {title}
            </Typography>
          ) : (
            <Skeleton width={300} height={28} />
          )}

          {type ? (
            <Typography fontSize={16} fontWeight={400} sx={{ maxWidth: 300 }}>
              Package: {type}
            </Typography>
          ) : (
            <Skeleton width={150} height={28} />
          )}

          {/* QUANTITY SELECTOR */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" size="small" sx={{ minWidth: 32 }}>-</Button>
            {quantity !== undefined ? (
              <Typography fontSize={16}>{quantity}</Typography>
            ) : (
              <Skeleton width={20} height={24} />
            )}
            <Button variant="outlined" size="small" sx={{ minWidth: 32 }}>+</Button>
          </Stack>

          {/* PRICE SECTION */}
          <Stack direction="row" alignItems="center" spacing={2}>
            {price !== undefined ? (
              <>
                <Typography fontSize={20} fontWeight={700} color="primary">
                  {price.toLocaleString()}đ
                </Typography>
                {oldPrice && (
                  <Typography fontSize={16} sx={{ textDecoration: "line-through", opacity: 0.6 }}>
                    {oldPrice.toLocaleString()}đ
                  </Typography>
                )}
                {discountPercent && (
                  <Box
                    sx={{
                      backgroundColor: "error.main",
                      color: "white",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 1,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {discountPercent}%
                  </Box>
                )}
                {/* TRASH ICON */}
                <IconButton color="error">
                  <Trash2 />
                </IconButton>
              </>
            ) : (
              <>
                <Skeleton width={60} height={28} />
                <Skeleton width={50} height={20} />
                <Skeleton width={40} height={20} />
              </>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
