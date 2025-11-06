"use client";

import {
  Box,
  Container,
  Link as MLink,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Mail, Phone, Copyright, MapPin } from "lucide-react";
import Image from "next/image";
import logo from "public/logo.png";

export default function Footer() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const iconSize = mdUp ? 20 : 18;
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        pt: { xs: 3, md: 5 },
        pb: { xs: 1, md: 2 },
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 6 }}
          alignItems={{ xs: "center", md: "flex-start" }}
          justifyContent="space-between"
        >
          {/* Brand */}
          <Box
            sx={{
              width: { xs: 160, md: 180 },
              height: "100%",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image
              src={logo}
              alt="DigiShop"
              style={{
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Columns */}
          <Box
            sx={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: {
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 3, sm: 4, md: 5 },
            }}
          >
            {/* Introduction */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: 18, md: 20 },
                  color: "text.primary",
                }}
              >
                Introduction
              </Typography>

              <Stack spacing={1.5}>
                <MLink
                  href="/how-to-buy"
                  underline="none"
                  color="text.primary"
                  sx={{
                    fontSize: { xs: 15, md: 17 },
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#88DEF1" },
                  }}
                >
                  How to Buy
                </MLink>

                <Box>
                  <Typography
                    color="text.primary"
                    sx={{ fontSize: { xs: 15, md: 17 } }}
                  >
                    Payment Methods
                  </Typography>
                  <Stack direction="row" spacing={2} mt={1}>
                    <Image src="/momo-pay.png" alt="MoMo" width={70} height={10}/>
                    <Image src="/vnpay.jpg" alt="VNPay" width={80} height={25} />
                    <Image src="/vietqr.png" alt="VietQR" width={80} height={50} />
                  </Stack>
                </Box>

                <MLink
                  href="/terms"
                  underline="none"
                  color="text.primary"
                  sx={{
                    fontSize: { xs: 15, md: 17 },
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#88DEF1" },
                  }}
                >
                  Terms of Use
                </MLink>
              </Stack>
            </Box>

            {/* Contact Info */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: 18, md: 20 },
                  color: "text.primary",
                }}
              >
                Contact Information
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 15, md: 17 },
                  mb: 1.5,
                  fontWeight: 600,
                }}
              >
                HCMUTE-Group Company
              </Typography>

              <Stack spacing={1} sx={{ color: "text.primary" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone size={iconSize} />
                  <MLink
                    href="tel:0123456789"
                    underline="none"
                    color="inherit"
                    sx={{ fontSize: { xs: 15, md: 17 } }}
                  >
                    0123456789
                  </MLink>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Mail size={iconSize} />
                  <MLink
                    href="mailto:contact@digishop.com"
                    underline="none"
                    color="inherit"
                    sx={{ fontSize: { xs: 15, md: 17 } }}
                  >
                    contact@digishop.com
                  </MLink>
                </Stack>

                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <MapPin size={20} style={{ minWidth: 20, minHeight: 20 }} />
                  <Typography
                    sx={{ fontSize: { xs: 15, md: 17 }, lineHeight: 1.5 }}
                  >
                    268 Ly Thuong Kiet, Dien Hong Ward, Ho Chi Minh City, Vietnam
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Socials */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: 18, md: 20 },
                  color: "text.primary",
                }}
              >
                Follow us on
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <MLink
                  href="https://facebook.com/DigiShop"
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.primary",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Image
                    src="/facebook.png"
                    alt="Facebook"
                    width={35}
                    height={35}
                  />
                </MLink>
              </Stack>
            </Box>
          </Box>
        </Stack>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            mt: { xs: 4, md: 5 },
            pt: { xs: 2, md: 3 },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 14, md: 16 },
              color: "text.secondary",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Copyright size={16} />
            {currentYear} DigiShop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
