import postgres from "postgres";
import { Product, ProductType } from "./definition";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

let schemaInitialized = false;
async function ensureSchema() {
  if (schemaInitialized) return;
  await sql`SET client_min_messages TO warning;`;
  // category
  await sql`
    CREATE TABLE IF NOT EXISTS category (
      category_id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
  `;
  // product
  await sql`
    CREATE TABLE IF NOT EXISTS product (
      product_id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      category_id INT REFERENCES category(category_id) ON DELETE SET NULL,
      image_url VARCHAR(255),
      info TEXT NOT NULL DEFAULT '',
      order_fulfillment TEXT NOT NULL DEFAULT '',
      warranty_period TEXT NOT NULL DEFAULT '',
      warranty_method TEXT NOT NULL DEFAULT ''
    );
  `;
  // product_type
  await sql`
    CREATE TABLE IF NOT EXISTS product_type (
      product_type_id SERIAL PRIMARY KEY,
      product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
      type VARCHAR(100) NOT NULL,
      original_price INTEGER NOT NULL,
      discount_price INTEGER,
      stock INTEGER DEFAULT 0,
      UNIQUE (product_id, type)
    );
  `;
  schemaInitialized = true;
}

export async function getProducts(
  page = 1,
  limit = 12,
  category?: string
): Promise<Product[]> {
  await ensureSchema();
  const offset = (page - 1) * limit;
  if (category) {
    return await sql`
      SELECT p.product_id,
             p.name,
             p.image_url,
             MIN(pt.discount_price) AS discount_price,
             MIN(pt.original_price) AS original_price
      FROM product p
      LEFT JOIN product_type pt ON p.product_id = pt.product_id
      JOIN category c ON p.category_id = c.category_id
      WHERE c.name = ${category}
      GROUP BY p.product_id, p.name, p.image_url
      ORDER BY p.product_id
      LIMIT ${limit} OFFSET ${offset};
    `;
  }
  return await sql`
    SELECT p.product_id,
           p.name,
           p.image_url,
           MIN(pt.discount_price) AS discount_price,
           MIN(pt.original_price) AS original_price
    FROM product p
    LEFT JOIN product_type pt ON p.product_id = pt.product_id
    GROUP BY p.product_id, p.name, p.image_url
    ORDER BY p.product_id
    LIMIT ${limit} OFFSET ${offset};
  `;
}

export async function getProductsCount(category?: string): Promise<number> {
  await ensureSchema();
  if (category) {
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      WHERE c.name = ${category};
    `;
    return count;
  }
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count FROM product;
  `;
  return count;
}

export async function fetchProductData(
  page: number,
  limit: number,
  category?: string
) {
  const [products, total] = await Promise.all([
    getProducts(page, limit, category),
    getProductsCount(category),
  ]);
  return { products, total };
}

export async function getProductByName(name: string): Promise<Product | null> {
  await ensureSchema();
  const [product] = await sql<Product[]>`
    SELECT 
      p.product_id,
      p.name,
      p.image_url,
      MIN(pt.discount_price) AS discount_price,
      MIN(pt.original_price) AS original_price,
      MAX(pt.original_price) AS max_original_price,
      MIN(pt.discount_price) AS max_discount_price,
      MIN(pt.stock) AS stock,
      p.info,
      p.order_fulfillment,
      p.warranty_period,
      p.warranty_method
    FROM product AS p
    JOIN product_type AS pt ON p.product_id = pt.product_id
    WHERE p.name ILIKE ${name}
    GROUP BY p.product_id, p.name, p.image_url, p.info, p.order_fulfillment, p.warranty_period, p.warranty_method
    LIMIT 1;
  `;
  return product || null;
}

export type ProductTypeRow = {
  product_type_id: number;
  type: string;
  original_price: number;
  discount_price: number | null;
  stock: number | null;
};

export async function getProductTypesByProductId(
  productId: number
): Promise<ProductTypeRow[]> {
  await ensureSchema();
  return await sql<ProductTypeRow[]>`
    SELECT
      product_type_id,
      type,
      original_price::float8   AS original_price,
      discount_price::float8   AS discount_price,
      stock
    FROM product_type
    WHERE product_id = ${productId}
    ORDER BY product_type_id;
  `;
}

export async function getFirstProductTypeId(
  productId: number
): Promise<number | null> {
  const rows = await getProductTypesByProductId(productId);
  return rows[0]?.product_type_id ?? null;
}

export async function getProductCategoryById(id: number): Promise<string | null> {
  await ensureSchema();
  const result = await sql<{ category: string }[]>`
    SELECT c.name AS category
    FROM product AS p
    JOIN category AS c ON p.category_id = c.category_id
    WHERE p.product_id = ${id};
  `;
  return result[0]?.category ?? null;
}
