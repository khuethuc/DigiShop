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
import { Mail, Phone } from "lucide-react";
import NextLink from "next/link";
import Image from "next/image";
import logo from "public/logo.png";

export default function Footer() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const iconSize = mdUp ? 20 : 18;

  return (
    <Box
      component="footer"
      sx={(t) => ({
        bgcolor: "background.paper",
        borderTop: `1px solid ${t.palette.divider}`,
      })}
    >
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 } }}>
          <Box
            sx={{
              display: "grid",
              alignItems: "flex-start",
              rowGap: { xs: 3, md: 4 },
              columnGap: { xs: 2, md: 2 },
              gridTemplateColumns: {
                xs: "1fr",
                md: "auto 1fr",
              },
            }}
          >
            {/* Brand */}
            <Box>
              <Stack alignItems="flex-start" spacing={1}>
                <NextLink
                  href="/"
                  aria-label="Go to home"
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <Image
                    src={logo}
                    alt="DigiShop"
                    width={140}
                    height={140}
                    priority
                  />
                </NextLink>
              </Stack>
            </Box>

            {/* Introduction & Contact */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "minmax(200px, 320px) minmax(260px, 1fr)",
                  md: "minmax(220px, 340px) minmax(300px, 1fr)",
                },
                columnGap: { xs: 1, sm: 1.5, md: 2 },
                rowGap: { xs: 3, sm: 0 },
                alignItems: "start",
              }}
            >
              {/* Introduction */}
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 0.75,
                    color: "text.primary",
                    fontSize: { xs: 22, md: 28 },
                    lineHeight: 1.2,
                  }}
                >
                  Introduction
                </Typography>
                <Stack spacing={0.75}>
                  <MLink
                    href="/how-to-buy"
                    underline="none"
                    color="text.primary"
                    sx={{ fontSize: { xs: 16, md: 18 } }}
                  >
                    How to Buy
                  </MLink>
                  <MLink
                    href="/payment-methods"
                    underline="none"
                    color="text.primary"
                    sx={{ fontSize: { xs: 16, md: 18 } }}
                  >
                    Payment Methods
                  </MLink>
                  <MLink
                    href="/terms"
                    underline="none"
                    color="text.primary"
                    sx={{ fontSize: { xs: 16, md: 18 } }}
                  >
                    Terms of Use
                  </MLink>
                </Stack>
              </Box>

              {/* Contact */}
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 0.75,
                    color: "text.primary",
                    fontSize: { xs: 22, md: 28 },
                    lineHeight: 1.2,
                  }}
                >
                  Contact Information
                </Typography>
                <Stack spacing={0.75} sx={{ color: "text.primary" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Phone size={iconSize} />
                    <MLink
                      href="tel:0123456789"
                      underline="none"
                      color="inherit"
                      sx={{ fontSize: { xs: 16, md: 18 } }}
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
                      sx={{ fontSize: { xs: 16, md: 18 } }}
                    >
                      contact@digishop.com
                    </MLink>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Footer line */}
      <Box sx={(t) => ({ height: 2, bgcolor: "grey" })} />
    </Box>
  );
}
