"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
  InputAdornment,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAuth } from "@/components/product/Action"; // same helper as CartPage

interface OrderSectionProps {
  products: {
    price: number;
    quantity: number;
    oldPrice?: number;
    product_type_id?: number; // ensure it's included from cart
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
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);


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

  const handleConfirm = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method first!");
      return;
    }

    if (selectedPayment !== "vietqr") {
      alert("This payment method is not yet supported in simulation.");
      return;
    }

    const token = localStorage.getItem("digishop_auth") || sessionStorage.getItem("digishop_auth");

    if (!token) {
      setLoggedIn(false);
      setLoading(false);
      alert("You must be logged in to view your cart!");
      return;
    }

    setLoggedIn(true);

    const auth = getAuth();
    if (!auth?.email && !auth?.username) {
        router.push("/login");
        return;
    }

    try {
      setLoading(true);

      // ✅ Create order in DB
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: auth.email, // ensure getAuth() includes user_id or adapt
          payment_method: "vietqr",
          total_val: total,
          products: products.map((p) => ({
            product_type_id: p.product_type_id,
            quantity: p.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error("Order creation failed");
      const data = await res.json();

      // ✅ Redirect to checkout page with QR info
      router.push(
        `/checkout?order_id=${data.order_id}&vietqr_url=${encodeURIComponent(
          data.vietqrUrl
        )}&note=${encodeURIComponent(data.note)}&amount=${data.total_val}`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to create order!");
    } finally {
      setLoading(false);
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
                "& fieldset": { borderColor: "transparent" },
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
                      paddingX: 2.5,
                      borderColor: "#8A8A8A",
                      "&:hover": { bgcolor: "#f2f2f2" },
                      boxShadow: 1,
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
            gap: 1,
          }}
        >
          <Image src="/momo-pay.png" alt="MoMo Logo" height={30} width={40} />
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
            gap: 1,
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
          variant={selectedPayment === "vietqr" ? "contained" : "outlined"}
          fullWidth
          onClick={() => setSelectedPayment("vietqr")}
          sx={{
            border: selectedPayment === "vietqr" ? "solid 5px #64B7B4" : "0",
            // borderColor: selectedPayment === "vietqr" ? "#E3FFFE" : "transparent",
            bgcolor: "white",
            borderRadius: 1,
            height: 50,
            "&:hover": {
              bgcolor: "#f2f2f2",
            },
            gap: 1,
          }}
        >
          <Image src="/vietqr_1.png" alt="VietQR Logo" width={80} height={50} />
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
          alignSelf: "center",
        }}
        disabled={loading}
        onClick={handleConfirm}
      >
        {loading ? "..." : "Confirm"}
      </Button>
    </Stack>
  );
}
