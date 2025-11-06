"use server";

import { getProducts, getProductsCount } from "@/app/lib/product-action";

export async function fetchProductData(page: number, limit: number) {
  const [products, total] = await Promise.all([
    getProducts(page, limit),
    getProductsCount(),
  ]);

  return { products, total };
}
