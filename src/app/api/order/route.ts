// /app/api/orders/route.ts
import { NextResponse } from "next/server";
import postgres from "postgres";
import { getUserId } from "@/app/lib/user";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: Request) {
    const body = await req.json();
    const loginId = String(body.email ?? "").toLowerCase();

    const userId = await getUserId(loginId);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }
  const data = await req.json();
  const { user_id, payment_method, total_val, products } = data;

  // 1. Insert into ORDER_OWNER
  const orderOwner = await sql`
    INSERT INTO ORDER_OWNER (user_id, payment_method, total_val)
    VALUES (${user_id}, ${payment_method}, ${total_val})
    RETURNING order_id, created_at;
  `;

  // result is an array of rows
  const { order_id, created_at } = orderOwner[0];

  // 2. Insert products into ORDER
  for (const item of products) {
    await sql`
      INSERT INTO "ORDER" (order_id, product_type_id, quantity)
      VALUES (${order_id}, ${item.product_type_id}, ${item.quantity});
    `;
  }

  // 3. Return VietQR data
  const bankCode = "VCB";
  const accountNumber = "0123456789";
  const accountName = "DigiShop";
  const note = `DigiShop - Payment for Order ${order_id}`;

  const vietqrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${total_val}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(accountName)}`;

  return NextResponse.json({
    order_id,
    vietqrUrl,
    note,
    total_val,
    created_at,
  });
}
