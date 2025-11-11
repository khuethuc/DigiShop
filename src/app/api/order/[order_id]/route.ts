import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  req: Request,
  context: { params: { order_id: string } | Promise<{ order_id: string }> }
) {
  // unwrap params if it's a promise
  const { params } = context;
  const { order_id: idStr } = await params; // <--- await here
  const id = Number(idStr);

  if (Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: "Invalid order ID" }, { status: 400 });
  }

  const order = await sql`
    SELECT order_id, qr_url, note, total_val, created_at
    FROM ORDER_OWNER
    WHERE order_id = ${id};
  `;

  if (!order[0]) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order[0]);
}
