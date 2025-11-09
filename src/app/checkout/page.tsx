"use client";

import { Stack, Typography, Box } from "@mui/material";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckOutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const amount = params.get("amount");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 min = 1800 seconds

  // Your bank details
  const BANK_CODE = "VCB";
  const ACCOUNT_NUMBER = "0123456789";
  const ACCOUNT_NAME = "DigiShop";

  const note = `Order ${orderId}`;
  const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;


  // countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // auto-redirect when time runs out
  useEffect(() => {
    if (timeLeft === 0) alert("Time expired. Please try again.");
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const handleSimulatePayment = () => {
    // simulate inserting into DB, then redirect to success
    const fakeOrderId = Math.floor(Math.random() * 9000 + 1000);
    router.push(`/success?id=${fakeOrderId}`);
  };

  return (
    <Stack direction="row" spacing={6} sx={{ p: 5 }}>
      <Stack spacing={4} alignItems="center">
        <Image
          src="/vietqr_1.png"
          alt="VietQR Logo"
          width={150}
          height={70}
        />
        {/* Example static QR */}
        <Image
          src="/vietqr_sample.png"
          alt="QR Code"
          width={250}
          height={250}
        />
        <Typography fontSize={22} fontWeight={600}>
          Total: {Number(amount).toLocaleString()}đ
        </Typography>
        <Typography color="red" fontWeight={600}>
          {minutes}:{seconds}
        </Typography>

        <Box>
          <button
            onClick={handleSimulatePayment}
            style={{
              background: "#004AAD",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Simulate Successful Payment
          </button>
        </Box>
      </Stack>

      <Stack spacing={2} sx={{ maxWidth: 400 }}>
        <Typography variant="h6" sx={{ color: "red" }}>
          NOTE: PLEASE COMPLETE PAYMENT WITHIN 30 MINUTES!
        </Typography>
        <Typography>Step 1: Log in to your banking app.</Typography>
        <Typography>Step 2: Scan the QR code.</Typography>
        <Typography>
          Step 3: Confirm the payment and wait a moment for DigiShop to process your order.
        </Typography>
      </Stack>
    </Stack>
  );
}
