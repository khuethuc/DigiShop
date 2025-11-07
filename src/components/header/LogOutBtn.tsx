"use client";
import { signOut } from "next-auth/react";
import { Button } from "@mui/material";

export default function LogOutBtn() {
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Log out
    </Button>
  );
}