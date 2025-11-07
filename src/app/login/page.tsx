"use client"
import LoginForm from "@/components/authentication/LoginForm";
import {Stack, Box, Button, Typography, Paper, Divider} from "@mui/material";
import Image  from "next/image";
import { Suspense } from 'react';
import Link from "@mui/material/Link";
import NextLink from "next/link";

export default function LoginPage() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{padding: 5,}}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 2,
        }}
      >
        <Stack alignItems="center" sx={{marginBottom: 5}}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{marginBottom: 5}}>
            <Image
              src="/logo.png"
              alt="DigiShop Logo"
              width={100}
              height={100}
            />
            <Typography 
              sx={{color: "#74DDEE", fontWeight: 600, fontSize: 25}}
            >
              DigiShop
            </Typography>
          </Stack>
        
          <Typography 
            sx={{fontWeight: 700, fontSize: 30}}
          >
            Sign In
          </Typography>
        </Stack>

        <Suspense>
          <LoginForm/>
        </Suspense>

        <Stack spacing={2} sx={{marginTop: 2}}>
        {/* Sign Up */}
          <Typography textAlign="center" fontSize={18}>
            Don’t have an account?{" "}
            <Link
                component={NextLink}
                href="/signup"
                underline="none"
                sx={{
                    color: "#2c7fff",
                    fontWeight: 600,
                    transition: "0.2s",
                    "&:hover": {
                    color: "#1a5bcc",
                    textDecoration: "underline",
                    },
                }}
                >
                Sign up
            </Link>
          </Typography>

          {/* Divider */}
          <Divider>Or continue with</Divider>

          {/* Google */}
          <Button
            variant="outlined"
            fullWidth
            size="large"
            sx={{
              borderRadius: 0.5,
              py: 1.4,
              textTransform: "none",
              fontWeight: 600,
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "1"
            }}
          >
            <Image src="/google.png" alt="Google logo" width={20} height={20} />
            Sign in with Google
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}