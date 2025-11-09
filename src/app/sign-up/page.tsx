"use client";

import SignUpForm from "@/components/authentication/SignUpForm";
import { Stack, Typography } from "@mui/material";

export default function SignUp() {
  return (
    <Stack spacing={4} sx={{ padding: 3 }}>
      <Typography variant="h4" fontWeight={700}>
        Create an account
      </Typography>
      <SignUpForm />
    </Stack>
  );
}