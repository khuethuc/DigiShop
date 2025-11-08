import { NextResponse } from "next/server";
import { users } from "@/app/lib/seed_data";

type SeedUser = {
  full_name: string;
  username: string;
  email: string;
  password: string; // plaintext trong seed_data để test
  birthday?: string;
  is_admin?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const loginId = String(body.email ?? body.username ?? "").toLowerCase();
    const pass = String(body.password ?? "");

    const found = (users as SeedUser[]).find(
      (u) =>
        (u.email?.toLowerCase() === loginId ||
          u.username?.toLowerCase() === loginId) &&
        u.password === pass
    );

    if (!found) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { password: _pw, ...publicUser } = found;
    const token = "seed-" + Math.random().toString(36).slice(2);

    return NextResponse.json({ ok: true, user: publicUser, token });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}