"use client";

import { Stack, Typography, Box, Button, Skeleton } from "@mui/material";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ClockFading } from "lucide-react";
import { getAuth } from "@/components/product/Action";

function OrderDetails({ order, order_id, timeLeft, minutes, seconds, onSimulatePayment }: any) {
  //format timestamp
  const createdDate = new Date(order.created_at);
  
  return (
    <Stack direction="row" justifyContent="center" spacing={6} sx={{ p: 5 }}>
      <Stack spacing={3} alignItems="center">
        {/* QR Code */}
        <Image
          src={order.qr_url || "/vietqr.png"}
          alt="QR Code"
          width={250}
          height={250}
        />

        {/* Total */}
        <Typography fontSize={22} fontWeight={600}>
          Total: {Number(order.total_val).toLocaleString()}đ
        </Typography>

        <Typography fontStyle="italic" color="gray">
          Note of transferment:<br/> {order.note}
        </Typography>

        {/* Countdown */}
        <Stack direction="row" spacing={2} alignItems="center">
          <ClockFading color="red" />
          <Typography color="red" fontWeight={600}>
            {minutes}:{seconds}
          </Typography>
        </Stack>

        {/* Simulate Payment */}
        <Box>
          <Button
            onClick={onSimulatePayment}
            sx={{
              backgroundColor: "#004AAD",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#5277a8" },
            }}
          >
            Simulate Successful Payment
          </Button>
        </Box>
      </Stack>

      {/* Instructions */}
      <Stack spacing={2}>
        <Image src="/vietqr_1.png" alt="VietQR Logo" width={150} height={70} />

        <Typography variant="h6" sx={{ color: "red" }}>
          NOTE: PLEASE COMPLETE PAYMENT WITHIN 30 MINUTES!
        </Typography>

        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Order ID: {order_id}</Typography>
        <Typography fontStyle="italic" color="gray">
          Created Time: {createdDate.toLocaleDateString()}{" "}{createdDate.toLocaleTimeString()}
        </Typography>

        <Typography>Step 1: Log in to your banking app.</Typography>
        <Typography>Step 2: Scan the QR code.</Typography>
        <Typography>
          Step 3: Confirm payment for <b>Order #{order_id}</b> and wait for DigiShop to process.
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function CheckOutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const order_id = params.get("order_id");
  const TIME_LIMIT = 1 * 60;

  const [order, setOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT); // 30 min

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      const cancelOrder = async () => {
        try {
          const auth = await getAuth(); // ✅ await here
                if (!auth?.email) return;
          
          const res = await fetch(`/api/order/${order_id}/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: auth.email,
              order_id: order_id,
            }),
          });
          if (!res.ok) throw new Error("Failed to cancel order");
          alert("Time expired. Your order is CANCELLED! Please try again.");
          router.push("/cart"); // redirect back to cart
        } catch (err) {
          console.error(err);
          alert("Failed to cancel the order. Please refresh and try again.");
        }
      };
      cancelOrder();
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const handleSimulatePayment = () => {
    router.push(`/order/${order_id}/success`);
  };

  // Fetch order data
  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch(`/api/order/${order_id}`);
      const data = await res.json();
      setOrder(data);
    }
    if (order_id) fetchOrder();
  }, [order_id]);

  // Suspense-like fallback using skeletons
  if (!order) {
    return (
      <Stack direction="row" justifyContent="center" spacing={6} sx={{ p: 5 }}>
        <Stack spacing={4} alignItems="center">
          <Skeleton variant="rectangular" width={250} height={250} />
          <Skeleton width={150} height={30} />
          <Skeleton width={100} height={30} />
          <Skeleton variant="rectangular" width={200} height={50} />
        </Stack>
        <Stack spacing={2}>
          <Skeleton width={150} height={50} />
          <Skeleton width={200} height={30} />
          <Skeleton width={250} height={20} />
          <Skeleton width={300} height={20} />
          <Skeleton width={200} height={20} />
        </Stack>
      </Stack>
    );
  }

  return (
    <Suspense fallback={<p>Loading order...</p>}>
      <OrderDetails
        order={order}
        order_id={order_id}
        timeLeft={timeLeft}
        minutes={minutes}
        seconds={seconds}
        onSimulatePayment={handleSimulatePayment}
      />
    </Suspense>
  );
}
