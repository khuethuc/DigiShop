"use client";

import { Box, Container, Typography, Stack } from "@mui/material";

export default function TermsPage() {
  return (
    <Box sx={{ bgcolor: "background.default", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          {/* Page title */}
          <Typography
            variant="h4"
            component="h1"
            fontWeight={800}
            textAlign="center"
            color="text.primary"
          >
            Terms of Use
          </Typography>

          {/* Intro */}
          <Typography variant="body1" color="text.secondary">
            Welcome to DigiShop. By accessing or using our website, you agree to
            comply with and be bound by the following Terms of Use. Please read
            them carefully before using our services.
          </Typography>

          {/* Section 1 */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              mb={1}
            >
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              By using DigiShop, you confirm that you have read, understood, and
              agree to be bound by these Terms of Use, along with our Privacy
              Policy. If you do not agree, please do not use our services.
            </Typography>
          </Box>

          {/* Section 2 */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              mb={1}
            >
              2. User Responsibilities
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You agree to use our platform responsibly and not engage in any
              activities that could harm, disable, or impair DigiShop or any
              associated systems. Any misuse of our services may result in the
              suspension or termination of your account.
            </Typography>
          </Box>

          {/* Section 3 */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              mb={1}
            >
              3. Intellectual Property
            </Typography>
            <Typography variant="body1" color="text.secondary">
              All content, including logos, images, and text displayed on
              DigiShop, are the intellectual property of DigiShop or its
              licensors. You may not copy, distribute, or reproduce any part of
              the site without prior written permission.
            </Typography>
          </Box>

          {/* Section 4 */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              mb={1}
            >
              4. Product Information
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We strive to provide accurate and up-to-date product information.
              However, DigiShop does not guarantee that descriptions or other
              content are entirely error-free, complete, or current.
            </Typography>
          </Box>

          {/* Section 5 */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              mb={1}
            >
              5. Limitation of Liability
            </Typography>
            <Typography variant="body1" color="text.secondary">
              DigiShop shall not be liable for any indirect, incidental, or
              consequential damages resulting from your use of our website or
              services. Your sole remedy for dissatisfaction with the site is to
              stop using it.
            </Typography>
          </Box>

          {/* Section 6 */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              mb={1}
            >
              6. Changes to Terms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              DigiShop reserves the right to update or modify these Terms of Use
              at any time without prior notice. Your continued use of the site
              after changes are posted constitutes acceptance of the new terms.
            </Typography>
          </Box>

          {/* Section 7 */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              mb={1}
            >
              7. Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              If you have any questions about these Terms of Use, please contact
              us at <strong>contact@digishop.com</strong>.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
