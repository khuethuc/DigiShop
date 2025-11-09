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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const full_name = String(body.full_name || "").trim();
    const username = String(body.username || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!full_name || !username || !email || !password) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // simple uniqueness checks against seed users (case-insensitive)
    const exists = (users as any[]).some(
      (u) => u.email?.toLowerCase() === email || u.username?.toLowerCase() === username.toLowerCase()
    );

    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Email or username already exists" },
        { status: 409 }
      );
    }

    const newUser = {
      full_name,
      username,
      email,
      password,
      birthday: body.birthday || undefined,
    };

    // add to in-memory seed users (non-persistent)
    (users as any[]).push(newUser);

    const { password: _pw, ...publicUser } = newUser as any;
    const token = "seed-" + Math.random().toString(36).slice(2);

    return NextResponse.json({ ok: true, user: publicUser, token });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}