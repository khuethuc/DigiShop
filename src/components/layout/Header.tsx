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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Menu, ChevronDown } from "lucide-react";
import NextLink from "next/link";
import Image from "next/image";
import logo from "public/logo.png";
import { useEffect, useState } from "react";
import SearchBar from "src/components/header/SearchBar";
import CardButton from "src/components/header/CardButton";
import LogOutBtn from "../header/LogOutBtn";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={scrolled ? 3 : 0}
      sx={(theme) => ({
        transition: "all 0.5s ease",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none", // ✅ for Safari
        bgcolor: scrolled ? "rgba(255, 255, 255, 0.9)" : "background.paper",
        borderBottom: scrolled
          ? "0.3px solid rgba(255,255,255,0.1)"
          : `1px solid ${theme.palette.divider}`,
      })}
    >
      {/* <Container maxWidth="xl" disableGutters> */}
      <Toolbar sx={{ minHeight: 88, gap: 2, px: { xs: 2, md: 3 } }}>
        {/* Left: Logo */}
        <NextLink
          href="/"
          aria-label="Go to home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            margin: 10,
          }}
        >
          <Image src={logo} alt="DigiShop" width={70} height={70} priority />
        </NextLink>

        {/* Middle: Nav links (hidden on mobile) */}
        <Stack
          direction="row"
          spacing={4}
          sx={{
            alignItems: "center",
            color: "text.primary",
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
          }}
        >
          <MLink underline="none" color="inherit" href="/" sx={linkStyle}>
            Home
          </MLink>

          <MLink
            underline="none"
            color="inherit"
            href="/products"
            sx={{
              ...linkStyle,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            Products
            <ChevronDown size={18} />
          </MLink>

          <MLink underline="none" color="inherit" href="#" sx={linkStyle}>
            Best Sellers
          </MLink>

          <MLink
            underline="none"
            color="inherit"
            href="/how-to-buy"
            sx={linkStyle}
          >
            How to Buy
          </MLink>
        </Stack>

        {/* Mobile: Menu button */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton onClick={() => setOpenDrawer(true)}>
            <Menu />
          </IconButton>
        </Box>

        {/* Search */}
        <Box
          sx={{
            flex: 2,
            justifyContent: "center",
          }}
        >
          <SearchBar />
        </Box>

        {/* Right side: Cart + Auth buttons (ALWAYS visible) */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CardButton />

          <Button
            component={NextLink}
            href="/login"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 9999,
              px: { xs: 2, md: 3 },
              height: { xs: 40, md: 46 },
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "0 6px 14px rgba(44,127,255,0.25)",
              fontSize: { xs: 14, md: 16 },
            }}
          >
            Login
          </Button>

          <Button
            component={NextLink}
            href="/signup"
            variant="outlined"
            sx={(theme) => ({
              borderRadius: 9999,
              px: { xs: 2, md: 3 },
              height: { xs: 40, md: 46 },
              borderColor: theme.palette.divider,
              textTransform: "none",
              color: "text.primary",
              bgcolor: "background.paper",
              fontSize: { xs: 14, md: 16 },
            })}
          >
            Register
          </Button>
          {/* <LogOutBtn/> */}
        </Stack>
      </Toolbar>
      {/* </Container> */}

      {/* Drawer (for small screen nav links) */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {[
              { text: "Home", href: "/" },
              { text: "Products", href: "/products" },
              { text: "Best Sellers", href: "#" },
              { text: "How to Buy", href: "/how-to-buy" },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={NextLink} href={item.href}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

const linkStyle = {
  fontSize: 18,
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#88DEF1",
  },
};
