import { NextResponse } from "next/server";
import { products as seedProducts, productTypes as seedTypes } from "@/app/lib/seed_data";
import type { ProductCardProps } from "@/type/product-type";

export async function GET() {
  const items: ProductCardProps[] = seedProducts.map((p) => {
    const types = seedTypes.filter((t) => t.product_name === p.name);
    const originals = types.map((t) => Number(t.original_price)).filter((n) => Number.isFinite(n));
    const discounts = types
      .map((t) => Number(t.discount_price ?? t.original_price))
      .filter((n) => Number.isFinite(n));

    const minOriginal = originals.length ? Math.min(...originals) : undefined;
    const minDiscount = discounts.length ? Math.min(...discounts) : minOriginal;

    const pct =
      minOriginal !== undefined &&
      minDiscount !== undefined &&
      minOriginal > 0
        ? Math.round((1 - minDiscount / minOriginal) * 100)
        : undefined;

    const item: ProductCardProps = {
      image: p.image_url ?? "/products/placeholder.png",
      title: p.name,
      subtitle: p.warranty_period || "Top pick",
      price: Number(minDiscount ?? 0),
      ...(minOriginal !== undefined ? { oldPrice: Number(minOriginal) } : {}),
      ...(pct !== undefined ? { discount: `${pct}%` } : {}),
    };
    return item;
  });

  const top6 = items
    .sort(
      (a, b) =>
        (parseInt(b.discount || "0") || 0) -
        (parseInt(a.discount || "0") || 0)
    )
    .slice(0, 6);

  return NextResponse.json({ ok: true, items: top6 }, { headers: { "Cache-Control": "no-store" } });
}