"use client";

import { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const full_name = String(form.get("full_name") || "").trim();
    const username = String(form.get("username") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    const birthday = String(form.get("birthday") || "").trim();

    if (!full_name || !username || !email || !password) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/authentication", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, username, email, password, birthday }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Registration failed");
      } else {
        // store minimal auth info in sessionStorage
        sessionStorage.setItem(
          "digishop_auth",
          JSON.stringify({ token: data.token, email: data.user.email, username: data.user.username, full_name: data.user.full_name })
        );
        setSuccess("Account created. Redirecting...");
        setTimeout(() => router.push("/"), 900);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ maxWidth: 520 }}>
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={500}>
            Full name*
          </Typography>
          <TextField name="full_name" placeholder="Your full name" required fullWidth />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={500}>
            Username*
          </Typography>
          <TextField name="username" placeholder="username" required fullWidth />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={500}>
            Email*
          </Typography>
          <TextField name="email" type="email" placeholder="you@example.com" required fullWidth />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField name="password" type="password" placeholder="Password" label="Password*" required fullWidth />
          <TextField name="confirm" type="password" placeholder="Confirm" label="Confirm*" required fullWidth />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={500}>
            Birthday (optional)
          </Typography>
          <TextField name="birthday" type="date" InputLabelProps={{ shrink: true }} fullWidth />
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ fontWeight: 600 }}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </Stack>
    </form>
  );
}
