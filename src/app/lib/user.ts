import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });


export async function getUserId(loginId: string) {
  if (!loginId) return null;
  const [u] = await sql<{ id: number }[]>`
    SELECT id FROM "user"
    WHERE lower(email) = ${loginId} OR lower(username) = ${loginId}
    LIMIT 1;
  `;
  return u?.id ?? null;
}