import { NextResponse } from "next/server";
import postgres from "postgres";
import { getUserId } from "@/app/lib/user";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const loginId = String(body.email ?? body.username ?? "").toLowerCase();

    const userId = await getUserId(loginId);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const cartItems = await sql`
      SELECT 
        c.product_type_id,
        c.quantity,
        pt.product_id,
        pt.type,
        pt.original_price,
        pt.discount_price,
        p.name,
        p.image_url
      FROM cart AS c
      JOIN product_type AS pt ON c.product_type_id = pt.product_type_id
      JOIN product AS p ON pt.product_id = p.product_id
      WHERE c.user_id = ${userId};
    `;

    const products = cartItems.map((item) => ({
      product_id: item.product_id,
      product_type_id: item.product_type_id,
      title: item.name,
      type: item.type,
      image: item.image_url,
      price: item.discount_price,
      oldPrice: item.original_price,
      quantity: item.quantity,
    }));

    // ✅ Include total count in response
    return NextResponse.json({
      ok: true,
      count: products.length,
      products,
    });  
  } catch (e) {
    console.error("GET /api/cart error:", e);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
