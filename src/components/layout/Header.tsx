"use client";

import {
  Avatar,
  AppBar,
  Toolbar,
  Box,
  Button,
  Link as MLink,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { Menu, ChevronDown, LogIn, LogOut } from "lucide-react";
import { Menu as MMenu, MenuItem } from "@mui/material";
import NextLink from "next/link";
import Image from "next/image";
import logo from "public/logo.png";
import { useEffect, useState } from "react";
import SearchBar from "src/components/header/SearchBar";
import CardButton from "src/components/header/CardButton";
import { categories } from "@/app/lib/seed_data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    full_name: string;
    email: string;
    is_admin: boolean;
  } | null>(null);
  const [flashMessage, setFlashMessage] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const [productsAnchor, setProductsAnchor] = useState<null | HTMLElement>(
    null
  );
  const openProducts = Boolean(productsAnchor);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored =
      localStorage.getItem("digishop_auth") ||
      sessionStorage.getItem("digishop_auth");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("digishop_auth");
    sessionStorage.removeItem("digishop_auth");
    setUser(null);
    console.log("Logout...");
    window.location.href='/';
    // Show flash message
    setFlashMessage({
      message: "You have logged out successfully.",
      severity: "success",
    });
  };

  var avatarUrl = "";
  if (user) avatarUrl = `https://avatar.iran.liara.run/public/boy`;
  const activeScrolled = mounted && scrolled;

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={activeScrolled ? 3 : 0}
        sx={(theme) => ({
          transition: "all 0.4s ease",
          backdropFilter: activeScrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: activeScrolled ? "blur(20px)" : "none",
          bgcolor: activeScrolled
            ? "rgba(255,255,255,0.9)"
            : "background.paper",
          borderBottom: activeScrolled
            ? "0.3px solid rgba(255,255,255,0.1)"
            : `1px solid ${theme.palette.divider}`,
        })}
      >
        <Toolbar sx={{ minHeight: 88, gap: 2, px: { xs: 2, md: 3 } }}>
          <NextLink
            href="/"
            aria-label="Go to home"
            style={{ display: "inline-flex", alignItems: "center", margin: 10 }}
          >
            <Image src={logo} alt="DigiShop" width={70} height={70} priority />
          </NextLink>

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
            {/* Products link + dropdown trigger grouped tightly */}
            <Box
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
            >
              <MLink
                underline="none"
                color="inherit"
                href="/products"
                sx={linkStyle}
              >
                Products
              </MLink>
              <IconButton
                size="small"
                aria-label="Open product categories"
                onClick={(e) => setProductsAnchor(e.currentTarget)}
                sx={{ p: 0.25 }} // tighter padding
              >
                <ChevronDown size={18} />
              </IconButton>
            </Box>
            <MMenu
              anchorEl={productsAnchor}
              open={Boolean(productsAnchor)}
              onClose={() => setProductsAnchor(null)}
              MenuListProps={{ dense: true, sx: { minWidth: 220 } }}
            >
              {categories.map((c) => (
                <MenuItem
                  key={c.name}
                  component={NextLink}
                  href={`/products?category=${encodeURIComponent(c.name)}`}
                  onClick={() => setProductsAnchor(null)}
                >
                  {c.name}
                </MenuItem>
              ))}
            </MMenu>
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

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={() => setOpenDrawer(true)}>
              <Menu />
            </IconButton>
          </Box>

          <Box sx={{ flex: 2, justifyContent: "center" }}>
            <SearchBar />
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <CardButton />

            {!mounted ? (
              // Skeleton placeholder while waiting
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="circular" width={44} height={44} />
                <Skeleton variant="text" width={100} height={32} />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={40}
                  sx={{ borderRadius: 9999 }}
                />
              </Stack>
            ) : user ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Avatar
                  src={avatarUrl}
                  alt="avatar"
                  sx={{ width: 44, height: 44 }}
                />
                <Button
                  variant="text"
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: 18 }}
                >
                  {user.username}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 9999,
                    px: { xs: 2, md: 3 },
                    height: { xs: 40, md: 46 },
                    textTransform: "none",
                    gap: 1,
                  }}
                >
                  <LogOut /> Logout
                </Button>
              </Stack>
            ) : (
              <>
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
                    gap: 1,
                  }}
                >
                  <LogIn /> Login
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
              </>
            )}
          </Stack>
        </Toolbar>

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

      <Snackbar
        open={!!flashMessage}
        autoHideDuration={3000}
        onClose={() => setFlashMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        children={
          <Alert
            onClose={() => setFlashMessage(null)}
            severity={flashMessage?.severity || "info"}
            sx={{ width: "100%" }}
          >
            {flashMessage?.message || ""}
          </Alert>
        }
      />
    </>
  );
}

const linkStyle = {
  fontSize: 18,
  transition: "color 0.3s ease",
  "&:hover": { color: "#88DEF1" },
};
