import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// async function ensureSchema() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS cart (
//       cart_id SERIAL PRIMARY KEY,
//       user_id INT NOT NULL,
//       product_type_id INT NOT NULL,
//       quantity INT NOT NULL DEFAULT 1,
//       created_at TIMESTAMPTZ DEFAULT now(),
//       updated_at TIMESTAMPTZ DEFAULT now(),
//       UNIQUE (user_id, product_type_id),
//       FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
//       FOREIGN KEY (product_type_id) REFERENCES product_type(product_type_id) ON DELETE CASCADE
//     );
//   `;
// }

async function getUserId(loginId: string) {
  if (!loginId) return null;
  const [u] = await sql<{ id: number }[]>`
    SELECT id FROM "user"
    WHERE lower(email) = ${loginId} OR lower(username) = ${loginId}
    LIMIT 1;
  `;
  return u?.id ?? null;
}

export async function POST(req: Request) {
  try {
    //await ensureSchema();

    const body = await req.json();
    const product_type_id = Number(body.product_type_id);
    const loginId = String(body.email ?? body.username ?? "").toLowerCase();

    if (!product_type_id) {
      return NextResponse.json({ ok: false, error: "product_type_id is required" }, { status: 400 });
    }
    const userId = await getUserId(loginId);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const [pt] = await sql<{ product_type_id: number }[]>`
      SELECT product_type_id FROM product_type WHERE product_type_id = ${product_type_id} LIMIT 1;
    `;
    if (!pt?.product_type_id) {
      return NextResponse.json({ ok: false, error: "Product type not found" }, { status: 404 });
    }

    await sql`
      INSERT INTO cart (user_id, product_type_id, quantity)
      VALUES (${userId}, ${product_type_id}, 1)
      ON CONFLICT (user_id, product_type_id)
      DO UPDATE SET quantity = cart.quantity + 1;
    `;

    // optional: trả về tổng số item
    const [{ total }] = await sql<{ total: number }[]>`
      SELECT COALESCE(SUM(quantity),0)::int AS total FROM cart WHERE user_id = ${userId};
    `;

    return NextResponse.json({ ok: true, total });
  } catch (e) {
    console.error("POST /api/add-to-cart", e);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}