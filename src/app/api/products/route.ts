import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Lazy import để không tạo kết nối DB khi build/validate
  const { getProducts, getProductsCount } = await import("@/app/lib/product-action");

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));

  try {
    const [products, total] = await Promise.all([
      getProducts(page, limit),
      getProductsCount(),
    ]);

    return NextResponse.json(
      { ok: true, page, limit, total, products },
      { headers: { "Cache-Control": "no-store, must-revalidate" } }
    );
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}