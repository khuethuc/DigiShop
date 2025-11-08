import { NextResponse } from "next/server";
import { getProducts, getProductsCount } from "@/app/lib/product-action";

export const revalidate = 0;            // hoặc dùng dynamic = "force-dynamic"
export const dynamic = "force-dynamic"; // tùy chọn

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10))
  );

  try {
    const [products, total] = await Promise.all([
      getProducts(page, limit),
      getProductsCount(),
    ]);
    return NextResponse.json({ ok: true, page, limit, total, products });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}