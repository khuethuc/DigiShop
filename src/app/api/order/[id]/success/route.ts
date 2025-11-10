import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  // unwrap params if it's a promise
  const { params } = context;
  const { id: idStr } = await params; // <--- await here
  const id = Number(idStr);

  if (Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: "Invalid order ID" }, { status: 400 });
  }

  //clear qr and note, update status
  await sql`
    UPDATE order_owner
    SET qr_url = "",
        note = "",
        state = "completed",
        final_state_time = CURRENT.TIMESTAMP
    WHERE order_id = ${id};
  `;
  console.log("Update successful order");

  //Clear the cart


  //Decrese the quantity by 1

  return NextResponse.json({state: "success"});
}
