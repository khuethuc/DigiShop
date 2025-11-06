"use client";

import { Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import {CreditCard, ShoppingCart} from "lucide-react" 

export default function Actions() {
  const router = useRouter();

  const handleBuyNow = () => {
    // TODO: go to checkout page
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    // TODO: logic to add item to cart (stay on page)
    console.log("Added to cart");
  };

  return (
    <Stack direction="row" spacing={2} mt={3}>
      {/* Buy Now Button */}
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
          "&:hover": {
            bgcolor: "#027996",
          },
          boxShadow: 2
        }}
      >
        <CreditCard/> Buy Now
      </Button>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
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
          "&:hover": {
            borderColor: "#05c3f2",
            backgroundColor: "white"
          },
          gap: 1,
          boxShadow: 2
        }}
      >
        <ShoppingCart /> Add to Cart
      </Button>
    </Stack>
  );
}
