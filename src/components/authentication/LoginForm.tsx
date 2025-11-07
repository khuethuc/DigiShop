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
} from "@mui/material";
import NextLink from "next/link";
import { Mail, Eye, EyeOff, Lock, TriangleAlert } from "lucide-react";
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
        <form>
        <Stack spacing={3}>
          {/* Email */}
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={500}>
                Email*
            </Typography>
            <TextField
                name="email"
                type="email"
                placeholder="example@gmail.com"
                fullWidth
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <Mail size={20} />
                    </InputAdornment>
                    ),
                },
                }}
            />
            </Stack>


          {/* Password */}
            <Stack spacing={1}>
            <Typography variant="body2" fontWeight={500}>
                Password*
            </Typography>
            <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                fullWidth
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <Lock size={20} />
                    </InputAdornment>
                    ),
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff /> : <Eye />}
                        </IconButton>
                    </InputAdornment>
                    ),
                },
                }}
            />
            </Stack>

          {/* Remember + Forgot */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />

            <MUILink
              component={NextLink}
              href="/forgot-password"
              underline="hover"
              sx={{ fontSize: 17 }}
            >
              Forgot Password?
            </MUILink>
          </Stack>

          {/* ERROR
          <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <TriangleAlert className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div> */}

          {/* Sign-In */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              borderRadius: 0.5,
              py: 1.5,
              fontWeight: 600,
              boxShadow: "2"
            }}
          >
            Sign in
          </Button>

        </Stack>
        </form>
    
    );
}
