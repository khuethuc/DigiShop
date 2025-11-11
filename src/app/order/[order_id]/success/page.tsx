"use client";

import { Stack, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getAuth } from "@/components/product/Action";
import { Check } from 'lucide-react';


export default function SuccessfulPage() {
  const {order_id} = useParams();

  useEffect(() => {
    async function updateOrder() {
      const auth = await getAuth(); // ✅ await here
      if (!auth?.email) return;

      const res = await fetch(`/api/order/${order_id}/success`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: auth.email,
          order_id: order_id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to update order");
      }
    }

    updateOrder(); // ✅ actually call it
  }, [order_id]);

  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 5 }}>
      <Image src="/check.png" alt="Check Icon" width={100} height={100} />
      <Typography variant="h3" sx={{ color: "green", fontWeight: 600 }}>
        Order Successful!
      </Typography>
      <Typography variant="h5" sx={{ color: "green", fontWeight: 600 }}>
        Order ID: {order_id}
      </Typography>
      <Stack spacing={1} sx={{ maxWidth: 800 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Check />
          <Typography variant="body1" textAlign="justify">
            Check your email for your order details – including the code or account and next steps.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Check />
          <Typography variant="body1" textAlign="justify">
            If it hasn’t arrived yet, give it a little time – it can take a few hours to process.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Check />
          <Typography variant="body1" textAlign="justify">
            If 24 hours pass and nothing shows up, reach out to us via hotline, chatbot, or email.
          </Typography>
        </Stack>
      </Stack>


      <Button
        component={Link}
        href="/"
        variant="outlined"
        color="primary"
        sx={{ borderRadius: 9999, px: 4, py: 1, fontSize: 18, mt: 2 }}
      >
        Turn back to Home
      </Button>
    </Stack>
  );
}
