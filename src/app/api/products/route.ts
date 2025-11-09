import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { getProducts, getProductsCount } = await import("@/app/lib/product-action");
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));
  const category = searchParams.get("category") || undefined;

  try {
    const [products, total] = await Promise.all([
      getProducts(page, limit, category),
      getProductsCount(category),
    ]);
    return NextResponse.json({ ok: true, page, limit, category, total, products });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}