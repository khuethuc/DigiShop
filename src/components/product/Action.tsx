"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Stack, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingCart } from "lucide-react";

type Props = {
  productTypeId?: number | string | null; // ✅ thêm null
  fallbackFirstId?: number | string | null; // ✅ thêm null
};

// ✅ Helper: đọc auth từ sessionStorage
function getAuth() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("digishop_auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ✅ Helper: chuẩn hóa ID
function toValidId(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? parseInt(v, 10) : (v as number);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function Actions({ productTypeId, fallbackFirstId }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [snack, setSnack] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // ✅ Lấy ID hợp lệ, ưu tiên productTypeId trước
  const computed = useMemo(() => {
    return toValidId(productTypeId) ?? toValidId(fallbackFirstId);
  }, [productTypeId, fallbackFirstId]);

  const [selectedId, setSelectedId] = useState<number | null>(computed ?? null);

  useEffect(() => {
    setSelectedId(computed ?? null);
  }, [computed]);

  // ✅ Debug ID
  useEffect(() => {
    console.log("🧩 Actions IDs:", {
      productTypeId,
      fallbackFirstId,
      selectedId,
    });
  }, [productTypeId, fallbackFirstId, selectedId]);

  // --- BUY NOW ---
  const handleBuyNow = () => {
    if (selectedId == null) {
      setSnack({ msg: "Please select a product type", type: "error" });
      return;
    }
    router.push(`/checkout?type=${selectedId}`);
  };

  // --- ADD TO CART ---
  const handleAddToCart = async () => {
    if (selectedId == null) {
      setSnack({ msg: "Please select a product type", type: "error" });
      return;
    }

    const auth = getAuth();
    if (!auth?.email && !auth?.username) {
      router.push("/login");
      return;
    }

    try {
      setAdding(true);

      const res = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_type_id: selectedId,
          email: auth.email,
          username: auth.username,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to add");

      setSnack({ msg: "Added to cart successfully", type: "success" });
    } catch (e: any) {
      setSnack({ msg: e?.message || "Error adding to cart", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2} mt={3}>
        {/* --- BUY NOW --- */}
        <Button
          onClick={handleBuyNow}
          variant="contained"
          sx={{
            bgcolor: "#05c3f2",
            fontWeight: 700,
            fontSize: 20,
            color: "white",
            px: 4,
            py: 3,
            borderRadius: 0.5,
            gap: 1,
            textTransform: "none",
            "&:hover": { bgcolor: "#027996" },
            boxShadow: 2,
          }}
        >
          <CreditCard /> Buy Now
        </Button>

        {/* --- ADD TO CART --- */}
        <Button
          onClick={handleAddToCart}
          disabled={adding}
          variant="outlined"
          sx={{
            fontWeight: 600,
            color: "#05c3f2",
            borderColor: "#d1d5db",
            fontSize: 19,
            px: 4,
            py: 3,
            borderRadius: 0.5,
            textTransform: "none",
            "&:hover": { borderColor: "#05c3f2", backgroundColor: "white" },
            gap: 1,
            boxShadow: 2,
          }}
        >
          <ShoppingCart /> {adding ? "Adding..." : "Add to Cart"}
        </Button>
      </Stack>

      {/* --- SNACKBAR --- */}
      <Snackbar
        open={!!snack}
        autoHideDuration={2400}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {snack ? (
          <Alert
            onClose={() => setSnack(null)}
            severity={snack.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snack.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}
