"use client";

import { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, CircularProgress, Alert } from "@mui/material";
import Image from "next/image";
import { generateVietQRUrl, QRPaymentData } from "@/lib/qrCode";
import { Check, Copy } from "lucide-react";

interface PaymentQRProps {
  amount: number;
  orderId: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  timeLeft?: number;
  onPaymentConfirm?: () => void;
}

export default function PaymentQR({
  amount,
  orderId,
  bankCode = "VCB",
  accountNumber = "0123456789",
  accountName = "DigiShop",
  timeLeft = 1800,
  onPaymentConfirm,
}: PaymentQRProps) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const qrData: QRPaymentData = {
        bankCode,
        accountNumber,
        accountName,
        amount: Math.round(amount),
        orderId,
        description: `Order ${orderId}`,
      };
      const url = generateVietQRUrl(qrData);
      setQrUrl(url);
      setLoading(false);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setLoading(false);
    }
  }, [amount, orderId, bankCode, accountNumber, accountName]);

  const handleCopyAccountInfo = async () => {
    const info = `Bank: ${bankCode}\nAccount: ${accountNumber}\nName: ${accountName}\nAmount: ${amount.toLocaleString()}đ`;
    try {
      await navigator.clipboard.writeText(info);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const isExpiring = timeLeft < 300; // 5 minutes warning

  return (
    <Stack spacing={3} alignItems="center" sx={{ p: 3, borderRadius: 2, bgcolor: "#f9f9f9" }}>
      {/* Header */}
      <Stack alignItems="center" spacing={1}>
        <Typography variant="h6" fontWeight={600}>
          QR Code Payment
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Scan with your mobile banking app
        </Typography>
      </Stack>

      {/* QR Code Display */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            width: 300,
            height: 300,
            border: "2px solid #ddd",
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "white",
          }}
        >
          {qrUrl && (
            <Image
              src={qrUrl}
              alt="Payment QR Code"
              fill
              priority
              style={{ objectFit: "contain" }}
              onError={(e) => {
                console.error("QR image load error:", e);
              }}
            />
          )}
        </Box>
      )}

      {/* Amount Display */}
      <Stack alignItems="center">
        <Typography variant="body2" color="textSecondary">
          Amount
        </Typography>
        <Typography variant="h5" fontWeight={700} color="primary">
          {amount.toLocaleString()}đ
        </Typography>
      </Stack>

      {/* Timer */}
      <Box
        sx={{
          p: 1,
          px: 2,
          borderRadius: 1,
          bgcolor: isExpiring ? "#fff3cd" : "#e8f5e9",
          border: `1px solid ${isExpiring ? "#ffc107" : "#4caf50"}`,
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color={isExpiring ? "#f57f17" : "success"}
        >
          Time Left: {minutes}:{seconds}
        </Typography>
      </Box>

      {/* Bank Info */}
      <Stack
        spacing={1}
        sx={{
          width: "100%",
          p: 2,
          bgcolor: "white",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          Bank Details (Manual Transfer)
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Bank
            </Typography>
            <Typography variant="body2">{bankCode}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body2">{amount.toLocaleString()}đ</Typography>
          </Box>
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="caption" color="textSecondary">
              Account
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
              {accountNumber}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="caption" color="textSecondary">
              Account Name
            </Typography>
            <Typography variant="body2">{accountName}</Typography>
          </Box>
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="caption" color="textSecondary">
              Message
            </Typography>
            <Typography variant="body2">Order {orderId}</Typography>
          </Box>
        </Box>
      </Stack>

      {/* Copy Button */}
      <Button
        variant="outlined"
        size="small"
        startIcon={copied ? <Check size={18} /> : <Copy size={18} />}
        onClick={handleCopyAccountInfo}
        sx={{ textTransform: "none" }}
      >
        {copied ? "Copied!" : "Copy Bank Info"}
      </Button>

      {/* Instructions */}
      <Alert severity="info" sx={{ width: "100%" }}>
        <Typography variant="body2">
          <strong>Step 1:</strong> Open your banking app
          <br />
          <strong>Step 2:</strong> Scan this QR code
          <br />
          <strong>Step 3:</strong> Confirm payment
          <br />
          <strong>Step 4:</strong> Wait for order confirmation
        </Typography>
      </Alert>

      {/* Confirm Button */}
      {onPaymentConfirm && (
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={onPaymentConfirm}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          I have completed the payment
        </Button>
      )}
    </Stack>
  );
}
