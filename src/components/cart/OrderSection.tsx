"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
  InputAdornment, IconButton 
} from "@mui/material";
import Image from "next/image";

interface OrderSectionProps {
  products: {
    price: number;
    quantity: number;
    oldPrice?: number;
  }[];
}

const VALID_DISCOUNT_CODE = "GIAM10";
const DISCOUNT_PERCENT = 0.1; // 10%

export default function OrderSection({ products }: OrderSectionProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);

  useEffect(() => {
    const subtotalValue = products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(subtotalValue);

    const discountValue = discountApplied ? subtotalValue * DISCOUNT_PERCENT : 0;
    setDiscount(discountValue);
    setTotal(subtotalValue - discountValue);
  }, [products, discountApplied]);

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === VALID_DISCOUNT_CODE) {
      setDiscountApplied(true);
      alert("✅ Discount code applied! 10% off your total.");
    } else {
      setDiscountApplied(false);
      alert("❌ Invalid discount code.");
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        backgroundColor: "#2C7FFF",
        color: "white",
        padding: 3,
        borderRadius: 2,
        minHeight: 500,
        height: "min-content",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      {/* Title */}
      <Typography variant="h2" sx={{ fontSize: 28, fontWeight: 600 }}>
        Order Details
      </Typography>

      {/* Discount Input */}
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
          Discount code
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            variant="outlined"
            placeholder="Enter discount code"
            size="small"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: "8px",
                "& fieldset": {
                    borderColor: "transparent",
                },
                "&:hover fieldset": {
                    borderColor: "#004AAD",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "#004AAD",
                },
                },
                "& input": { color: "black" },
            }}
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <Button
                        variant="outlined"
                        onClick={handleApplyDiscount}
                        sx={{
                            bgcolor: "white",
                            color: "#4F4F4F",
                            fontWeight: 600,
                            borderRadius: 0.5,
                            paddingX: 2.5, // adjust width
                            borderColor: "#8A8A8A",
                            "&:hover": { bgcolor: "#f2f2f2" },
                            boxShadow: 1
                        }}
                        >
                        Apply
                    </Button>
                </InputAdornment>
                ),
            }}
            />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.5)", my: 1 }} />

      {/* Price Summary */}
      <Stack spacing={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Subtotal</Typography>
          <Typography>{subtotal.toLocaleString()}đ</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Discount</Typography>
          <Typography>
            -{discount ? discount.toLocaleString() + "đ" : "0đ"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          <Typography>Total</Typography>
          <Typography>{total.toLocaleString()}đ</Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.5)", my: 1 }} />

      {/* Payment Buttons */}
      <Stack spacing={1}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#a50063",
            color: "white",
            fontWeight: 600,
            borderRadius: 1,
            height: 50,
            "&:hover": { bgcolor: "#8c0054" },
            gap: 1
          }}
        >
            <Image
                src="/momo-pay.png"
                alt="MoMo Logo"
                height={30}
                width={40}
            />
          MoMo Payment
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "white",
            color: "#004AAD",
            fontWeight: 700,
            borderRadius: 1,
            height: 50,
            "&:hover": { bgcolor: "#f2f2f2" },
            gap: 1
          }}
        >
            <Image
                src="/Logo-VNPAY-QR.webp"
                alt="VNPay Logo"
                width={100}
                height={50}
            />
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "white",
            color: "#D41F1F",
            fontWeight: 700,
            borderRadius: 1,
            height: 50,
            "&:hover": { bgcolor: "#f2f2f2" },
            gap: 1
          }}
        >
            <Image
                src="/vietqr_1.png"
                alt="VietQR Logo"
                width={80}
                height={50}
            />
        </Button>
      </Stack>

      <Button
        variant="contained"
        sx={{
          bgcolor: "white",
          color: "black",
          fontWeight: 700,
          borderRadius: 1,
          "&:hover": { bgcolor: "#f2f2f2" },
          width: 100,
          alignSelf: "center"
        }}
      >
        Confirm
      </Button>
    </Stack>
  );
}
