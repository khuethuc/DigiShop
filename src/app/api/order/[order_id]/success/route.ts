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

    // 2️⃣ Clear QR + note, mark as completed
    await sql`
      UPDATE order_owner
      SET qr_url = '',
          note = '',
          state = 'completed',
          final_state_time = CURRENT_TIMESTAMP
      WHERE order_id = ${order_id};
    `;
    console.log("✅ Order marked as completed");

    // 3️⃣ Clear the user's cart
    await sql`
      DELETE FROM cart
      WHERE user_id = ${user_id};
    `;
    console.log("✅ Cleared cart");

    // 4️⃣ Get sold items
    const soldItems = await sql`
      SELECT product_type_id
      FROM "order"
      WHERE order_id = ${order_id};
    `;

    // 5️⃣ Decrease stock for each sold item
    for (const item of soldItems) {
      await sql`
        UPDATE product_type
        SET stock = stock - 1
        WHERE product_type_id = ${item.product_type_id};
      `;
    }
    console.log("✅ Updated product stock");

    return NextResponse.json({ ok: true, state: "success" });
  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
