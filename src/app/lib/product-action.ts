import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type Product = {
  product_id: number;
  name: string;
  image_url: string;
  original_price: number;
  discount_price: number | null;
};

export async function getProducts(page = 1, limit = 12): Promise<Product[]> {
  const offset = (page - 1) * limit;

  const products = await sql<Product[]>`
    SELECT 
      p.product_id,
      p.name,
      p.image_url,
      MIN(pt.discount_price) AS discount_price,
      MIN(pt.original_price) AS original_price
    FROM product AS p
    JOIN product_type AS pt ON p.product_id = pt.product_id
    GROUP BY p.product_id, p.name, p.image_url
    ORDER BY p.name
    LIMIT ${limit} OFFSET ${offset};
    `;

  return products;
}

export async function getProductsCount(): Promise<number> {
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM product
  `;
  return count;
}

export async function fetchProductData(page: number, limit: number) {
  const [products, total] = await Promise.all([
    getProducts(page, limit),
    getProductsCount(),
  ]);

  return { products, total };
}
