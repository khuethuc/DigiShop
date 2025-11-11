"use client";

import { Stack, Typography, Box, Button } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PaymentQR from "@/components/payment/PaymentQR";

export default function CheckOutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const amount = params.get("amount") || "0";
  const [timeLeft, setTimeLeft] = useState(1800); // 30 min = 1800 seconds
  const [orderId] = useState(() => {
    // Generate or retrieve order ID
    const existingId = params.get("orderId");
    return existingId || `ORD-${Date.now()}`;
  });

  // Your bank details (update these with your actual bank info)
  const BANK_CODE = "VCB";
  const ACCOUNT_NUMBER = "0123456789";
  const ACCOUNT_NAME = "DigiShop";

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-redirect when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      alert("Payment time expired. Please try again.");
      router.push("/cart");
    }
  }, [timeLeft, router]);

  const handlePaymentConfirm = () => {
    // In production, you would verify the payment with your backend
    const fakeOrderId = Math.floor(Math.random() * 9000 + 1000);
    router.push(`/order/${fakeOrderId}/success?amount=${amount}`);
  };

  const handleCancelPayment = () => {
    router.push("/cart");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="center">
        {/* Left Column - QR Payment */}
        <Box sx={{ flex: 1, maxWidth: { md: "500px" } }}>
          <PaymentQR
            amount={Number(amount)}
            orderId={orderId}
            bankCode={BANK_CODE}
            accountNumber={ACCOUNT_NUMBER}
            accountName={ACCOUNT_NAME}
            timeLeft={timeLeft}
            onPaymentConfirm={handlePaymentConfirm}
          />
        </Box>

        {/* Right Column - Order Summary */}
        <Box sx={{ flex: 1, maxWidth: { md: "500px" } }}>
          <Stack
            spacing={3}
            sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "100%",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Order ID: {orderId}
              </Typography>
            </Box>

            <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">
                  {Number(amount).toLocaleString()}đ
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 1 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2">Free</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 1 }}>
                <Typography variant="body2">Tax:</Typography>
                <Typography variant="body2">Included</Typography>
              </Stack>
            </Box>

            <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {Number(amount).toLocaleString()}đ
                </Typography>
              </Stack>
            </Box>

            {/* Payment Status */}
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: timeLeft < 300 ? "#fff3cd" : "#e8f5e9",
                border: `1px solid ${timeLeft < 300 ? "#ffc107" : "#4caf50"}`,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color={timeLeft < 300 ? "#f57f17" : "success"}
              >
                Payment Deadline
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                color={timeLeft < 300 ? "#f57f17" : "success"}
                sx={{ mt: 0.5 }}
              >
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelPayment}
                fullWidth
              >
                Cancel Payment
              </Button>
              <Typography variant="caption" color="textSecondary" align="center">
                Your payment information is secure and encrypted
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
