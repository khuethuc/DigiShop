"use client";

import { Stack, Typography, Box, Button } from "@mui/material";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClockFading } from "lucide-react";

export default function CheckOutPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("order_id");
  const vietqrUrl = params.get("vietqr_url");
  const note = params.get("note");
  const amount = params.get("amount");

  const [timeLeft, setTimeLeft] = useState(1800); // 30 min = 1800 seconds

  // countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) alert("Time expired. Please try again.");
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const handleSimulatePayment = () => {
    router.push(`/success?id=${orderId}`);
  };

  return (
    <Stack direction="row" justifyContent="center" spacing={6} sx={{ p: 5 }}>
      <Stack spacing={4} alignItems="center">
        {/* Dynamically use the VietQR image from backend */}
        <Image
          src={vietqrUrl || "/vietqr.png"}
          alt="QR Code"
          width={250}
          height={250}
          unoptimized={!vietqrUrl?.startsWith("https://img.vietqr.io")}
        />

        <Typography fontSize={22} fontWeight={600}>
          Total: {Number(amount).toLocaleString()}đ
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <ClockFading color="red"/>
          <Typography color="red" fontWeight={600}>
            {minutes}:{seconds}
          </Typography>
        </Stack>

        <Box>
          <Button
            onClick={handleSimulatePayment}
            sx={{
              backgroundColor: "#004AAD",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              "&:hover":{
                backgroundColor: "#5277a8"
              }
            }}
          >
            Simulate Successful Payment
          </Button>
        </Box>
      </Stack>

      <Stack spacing={2}>
         <Image src="/vietqr_1.png" alt="VietQR Logo" width={150} height={70} />

        <Typography variant="h6" sx={{ color: "red" }}>
          NOTE: PLEASE COMPLETE PAYMENT WITHIN 30 MINUTES!
        </Typography>
        <Typography>Step 1: Log in to your banking app.</Typography>
        <Typography>Step 2: Scan the QR code.</Typography>
        <Typography>
          Step 3: Confirm payment for <b>Order #{orderId}</b> and wait for DigiShop to process.
        </Typography>
        <Typography fontStyle="italic" color="gray">
          Note of transferment: {note}
        </Typography>
      </Stack>
    </Stack>
  );
}
