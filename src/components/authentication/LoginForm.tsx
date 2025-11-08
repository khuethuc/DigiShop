"use client";

import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Link as MUILink,
  Alert,
} from "@mui/material";
import NextLink from "next/link";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const remember = form.get("remember") === "on";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
      } else {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(
          "digishop_auth",
          JSON.stringify({
            token: data.token,
            email: data.user.email,
            role: data.user.role,
          })
        );
        setSuccess("Đăng nhập mock thành công!");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={500}>
            Email*
          </Typography>
          <TextField
            name="email"
            type="email"
            placeholder="example@gmail.com"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={500}>
            Password*
          </Typography>
          <TextField
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControlLabel
              control={<Checkbox size="small" name="remember" />}
              label="Remember me"
            />
            <MUILink
              component={NextLink}
              href="/forgot-password"
              underline="hover"
              sx={{ fontSize: 17 }}
            >
              Forgot Password?
            </MUILink>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ fontWeight: 600 }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
