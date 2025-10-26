// src/components/layout/Header.tsx
"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Link as MLink,
  Stack,
  OutlinedInput,
  InputAdornment,
  Container,
} from "@mui/material";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import NextLink from "next/link";
import Image from "next/image";
import logo from "public/logo.png";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={(theme) => ({
        bgcolor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar sx={{ minHeight: 88, gap: 2, px: { xs: 2, md: 3 } }}>
          {/* Logo */}
          <NextLink
            href="/"
            aria-label="Go to home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <Image src={logo} alt="DigiShop" width={80} height={80} priority />
          </NextLink>

          {/* Nav links */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ alignItems: "center", color: "text.primary", mr: 2 }}
          >
            <MLink
              underline="none"
              color="inherit"
              href="#"
              sx={{ fontSize: 18 }}
            >
              Home
            </MLink>
            <MLink
              underline="none"
              color="inherit"
              href="#"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 18,
              }}
            >
              Products <ChevronDown size={18} />
            </MLink>
            <MLink
              underline="none"
              color="inherit"
              href="#"
              sx={{ fontSize: 18 }}
            >
              Best Sellers
            </MLink>
            <MLink
              underline="none"
              color="inherit"
              href="#"
              sx={{ fontSize: 18 }}
            >
              How to Buy
            </MLink>
          </Stack>

          {/* Search pill */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <OutlinedInput
              placeholder=" "
              startAdornment={
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              }
              sx={{
                width: "min(620px, 100%)",
                height: 48,
                px: 2,
                borderRadius: 9999,
                bgcolor: "background.paper",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
              }}
            />
          </Box>

          {/* Right actions */}
          <IconButton aria-label="cart" sx={{ color: "text.primary", mx: 1 }}>
            <ShoppingCart />
          </IconButton>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 9999,
                px: 3,
                height: 46,
                fontWeight: 800,
                textTransform: "none",
                boxShadow: "0 6px 14px rgba(44,127,255,0.25)",
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={(theme) => ({
                borderRadius: 9999,
                px: 3,
                height: 46,
                borderColor: theme.palette.divider,
                textTransform: "none",
                color: "text.primary",
                bgcolor: "background.paper",
                "&:hover": {
                  borderColor: theme.palette.divider,
                  bgcolor: "background.default",
                },
              })}
            >
              Register
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
