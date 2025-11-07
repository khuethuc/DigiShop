import postgres from "postgres";
import { Product, ProductType } from "./definition";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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

export async function getProductByName(name: string): Promise<Product | null> {
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

export async function getProductTypesById(product_id: number): Promise<ProductType[] | null> {
  const productTypes = await sql<ProductType[]>`
    SELECT 
      product_type_id,
      type,
      original_price,
      discount_price,
      stock
    FROM product_type
    WHERE product_id = ${product_id};
  `;

  return productTypes;
}

export async function getProductCategoryById(id: number): Promise<string | null> {
  // Run the query and get rows
  const result = await sql<{ category: string }[]>`
    SELECT c.name AS category
    FROM product AS p
    JOIN category AS c ON p.category_id = c.category_id
    WHERE p.product_id = ${id};
  `;

  // Return the category name if found, otherwise null
  return result[0]?.category ?? null;
}
