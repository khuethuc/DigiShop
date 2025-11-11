import { NextResponse } from "next/server";
import postgres from "postgres";
import { getUserId } from "@/app/lib/user";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const loginId = String(body.email ?? "").toLowerCase();
    const order_id = Number(body.order_id);

    if (!order_id || isNaN(order_id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // 1️⃣ Get user ID
    const user_id = await getUserId(loginId);
    if (!user_id) {
      return NextResponse.json(
        { ok: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    await sql`
      UPDATE order_owner
      SET qr_url = '',
          note = '',
          state = 'cancelled',
          final_state_time = CURRENT_TIMESTAMP
      WHERE order_id = ${order_id};
    `;
    console.log("Clear payment info and set status as cancelled");

    return NextResponse.json({ ok: true, state: "success" });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
