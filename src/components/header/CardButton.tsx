import { useTheme, useMediaQuery, IconButton } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";


export default function CartButton() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const iconSize = isSmall ? 22 : 32; // 👈 Smaller on mobile

  return (
    <IconButton component={Link}
          href="/cart" aria-label="cart" 
          sx={{ color: "text.primary" }}
    >
      <ShoppingCart size={iconSize} />
    </IconButton>
  );
}
