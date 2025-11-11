"use client";
import { Stack, Box, Typography, Divider } from "@mui/material";
import KeywordTag from "@/components/home/KeywordTag";
import PackageSelector from "@/components/product/PackageSelector";
import Actions from "@/components/product/Action";
import { useState, useMemo } from "react";

export type MainInfoProps = {
  title: string;
  quantity: number;
  category: string;
  discount_price: number | null;
  original_price: number;
  max_discount_price: number | null;
  max_original_price: number | null;
  types: {
    id: number;
    name: string;
    discount_price: number | null;
    original_price: number;
  }[];
};

export default function MainInfo(props: MainInfoProps) {
  const {
    title,
    quantity,
    category,
    discount_price,
    original_price,
    //max_discount_price,
   // max_original_price,
    types,
  } = props;

  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  // Compute displayed prices depending on current selection and types
  const displayPrice = useMemo(() => {
    // 🟢 Case 1: No types — use the product-level prices
    if (!types || types.length === 0) {
      return {
        discount: discount_price,
        original: original_price,
      };
    }

    // 🟢 Case 2: Only one type — show its price directly
    if (types.length === 1) {
      const t = types[0];
      return {
        discount: t.discount_price,
        original: t.original_price,
      };
    }

    // 🟢 Case 3: Multiple types
    const selected = types.find((t) => t.id === selectedTypeId);
    if (selected) {
      // A specific type is selected → show its own price
      return {
        discount: selected.discount_price,
        original: selected.original_price,
      };
    }

    // No type selected → show range (min–max)
    const validDiscounts = types.map((t) => t.discount_price ?? t.original_price);
    const minDiscount = Math.min(...validDiscounts);
    const maxDiscount = Math.max(...validDiscounts);
    const minOriginal = Math.min(...types.map((t) => t.original_price));
    const maxOriginal = Math.max(...types.map((t) => t.original_price));

    return {
      discount: minDiscount,
      discountMax: maxDiscount > minDiscount ? maxDiscount : null,
      original: minOriginal,
      originalMax: maxOriginal > minOriginal ? maxOriginal : null,
    };
  }, [selectedTypeId, types, discount_price, original_price]);

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: 25, md: 35, lg: 40 }, mb: 5 }}
        >
          {title}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Status: {quantity > 0 ? "In Stock" : "Out of Stock"}
        </Typography>

        <Stack direction="row" sx={{ marginBottom: 2 }}>
          <Typography variant="body1" gutterBottom>
            Category:
          </Typography>
          <KeywordTag label={category} size="md" mgLeft={3} />
        </Stack>

        {/* Price Section */}
        <Stack direction="row" spacing={5} mb={2}>
          {/* Discount or Final Price */}
          {displayPrice.discount != null && (
            <Typography
              fontWeight={700}
              sx={{
                fontSize: { xs: 13, sm: 15, md: 17, lg: 18 },
                color: "red",
              }}
            >
              {displayPrice.discount.toLocaleString("en-US")} ₫
              {displayPrice.discountMax && (
                <>
                  {" - "}
                  {displayPrice.discountMax.toLocaleString("en-US")} ₫
                </>
              )}
            </Typography>
          )}

          {/* Original Price */}
          {displayPrice.original != null && (
            <Typography
              color="textDisabled"
              sx={{ textDecoration: "line-through" }}
            >
              {displayPrice.original.toLocaleString("en-US")} ₫
              {displayPrice.originalMax && (
                <>
                  {" - "}
                  {displayPrice.originalMax.toLocaleString("en-US")} ₫
                </>
              )}
            </Typography>
          )}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "#68686880", borderBottomWidth: 1 }} />

      {/* Packages */}
      <Stack direction="row">
        {types && types.length > 0 ? (
          <PackageSelector
            options={types}
            onSelect={(pkg) => setSelectedTypeId(pkg.id)}
          />
        ) : (
          <Typography variant="body1" color="textSecondary">
            No package types available
          </Typography>
        )}
      </Stack>

      <Divider sx={{ borderColor: "#68686880", borderBottomWidth: 1 }} />

      {/* Actions (Add to Cart, etc.) */}
      <Box>
        <Actions productTypeId={selectedTypeId} />
      </Box>
    </Stack>
  );
}
