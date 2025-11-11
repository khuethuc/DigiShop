"use client";

import { useEffect, useState, Suspense } from "react";
import { Stack, Typography, Divider, Alert, Box, Skeleton } from "@mui/material";
import BigProductCard from "@/components/cart/BigProductCard";
import OrderSection from "@/components/cart/OrderSection";
import { getAuth } from "@/components/product/Action";
import { useRouter } from "next/navigation";

interface Product {
  product_id: number;
  product_type_id: number;
  title: string;
  type: string;
  image: string;
  price: number;
  oldPrice?: number;
  quantity: number;
}

function CartContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState<number>(1); // default 1 skeleton


  useEffect(() => {
    const token =
      localStorage.getItem("digishop_auth") ||
      sessionStorage.getItem("digishop_auth");

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

    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: auth.email,
        username: auth.username,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cart");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setCartCount(data.count);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load cart");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CartSkeleton count={cartCount} />;
  if (!loggedIn) return null;

  return (
    <Box sx={{ px: 10, py: 5, width: "100vw", boxSizing: "border-box" }}>
      <Typography variant="h1" sx={{ fontSize: 70, fontWeight: 600 }}>
        Cart
      </Typography>
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

      <Stack
        direction="row"
        spacing={4}
        sx={{
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "nowrap",
        }}
      >
        {/* LEFT COLUMN — product cards */}
        <Stack
          spacing={4}
          sx={{
            flexBasis: "65%",
            flexGrow: 1,
          }}
        >
          {products.length === 0 && (
            <Alert severity="info">Your cart is empty!</Alert>
          )}
          {products.map((p) => (
            <BigProductCard
              key={p.product_type_id}
              title={p.title}
              type={p.type}
              image={p.image}
              price={p.price}
              oldPrice={p.oldPrice}
              quantity={p.quantity}
            />
          ))}
        </Stack>

        {/* RIGHT COLUMN — order summary */}
        <Box
          sx={{
            flexBasis: "30%",
            flexGrow: 1,
          }}
        >
          <OrderSection products={products} />
        </Box>
      </Stack>
    </Box>
  );
}

/* 🦴 Skeleton Loader Component */
function CartSkeleton({ count = 1 }: { count?: number }) {
  return (
    <Box sx={{ px: 10, py: 5, width: "100vw", boxSizing: "border-box" }}>
      <Skeleton variant="text" width={300} height={80} />
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Stack direction="row" spacing={4}>
        <Stack spacing={4} sx={{ flexBasis: "65%" }}>
          {[...Array(count)].map((_, i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
            </Box>
          ))}
        </Stack>
        <Box sx={{ flexBasis: "30%" }}>
          <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
        </Box>
      </Stack>
    </Box>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
