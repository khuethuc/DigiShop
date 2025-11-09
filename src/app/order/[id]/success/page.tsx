"use client";

import { Stack, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessfulPage() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 5 }}>
      <Image src="/check.png" alt="Check Icon" width={100} height={100} />
      <Typography variant="h3" sx={{ color: "green", fontWeight: 600 }}>
        Order Successful!
      </Typography>
      <Typography variant="h5" sx={{ color: "green", fontWeight: 600 }}>
        Order ID: {id}
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ maxWidth: 600 }}>
        Check your email for your order details. If it hasn’t arrived yet, no worries — it can
        take a few hours to process. If more than 24 hours have passed and you still haven’t
        received anything, feel free to reach out to us via hotline, chatbot, or email.
      </Typography>

      <Button
        component={Link}
        href="/"
        variant="outlined"
        color="primary"
        sx={{ borderRadius: 9999, px: 4, py: 1, fontSize: 18, mt: 2 }}
      >
        Go Home
      </Button>
    </Stack>
  );
}
