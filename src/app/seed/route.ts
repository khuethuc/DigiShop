import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { NextResponse } from 'next/server';
import { users, categories, products, comments, responses, productTypes } from '../lib/seed_data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// --- Seed Users ---
async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      birthday DATE,
      is_admin BOOLEAN DEFAULT FALSE
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (u) => {
      const hashed = await bcrypt.hash(u.password, 10);
      return sql`
        INSERT INTO "user" (full_name, username, email, password, birthday, is_admin)
        VALUES (${u.full_name}, ${u.username}, ${u.email}, ${hashed}, ${u.birthday}, ${u.is_admin ?? false})
        ON CONFLICT (email) DO NOTHING;
      `;
    })
  );
  return insertedUsers;
}

// --- Seed Categories ---
async function seedCategories() {
  await sql`
    CREATE TABLE IF NOT EXISTS category (
      category_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );
  `;

  const insertedCategories = await Promise.all(
    categories.map((c) => sql`
      INSERT INTO category (name)
      VALUES (${c.name})
      ON CONFLICT (name) DO NOTHING;
    `)
  );
  return insertedCategories;
}

// --- Seed Products ---
async function seedProducts() {
  await sql`
    CREATE TABLE IF NOT EXISTS product (
      product_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      category_id INT REFERENCES category(category_id) ON DELETE SET NULL,
      image_url VARCHAR(255),
      info TEXT NOT NULL,
      order_fulfillment TEXT NOT NULL,
      warranty_period TEXT NOT NULL,
      warranty_method TEXT NOT NULL
    );
  `;

  const insertedProducts = await Promise.all(
    products.map(async (p) => {
      const cat = await sql`SELECT category_id FROM category WHERE name = ${p.category_name} LIMIT 1`;
      return sql`
        INSERT INTO product (name, category_id, image_url, info, order_fulfillment, warranty_period, warranty_method)
        VALUES (${p.name}, ${cat[0]?.category_id}, ${p.image_url || '/products/placeholder.png'}, ${p.info}, ${p.order_fulfillment}, ${p.warranty_period}, ${p.warranty_method})
        ON CONFLICT (name) DO NOTHING;
      `;
    })
  );
  return insertedProducts;
}

// --- Seed Comments ---
async function seedComments() {
  await sql`
    CREATE TABLE IF NOT EXISTS comment (
      comment_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
      product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedComments = await Promise.all(
    comments.map(async (c) => {
      return sql`
        INSERT INTO comment (user_id, product_id, content)
        VALUES (${c.user_id}, ${c.product_id}, ${c.content})
        ON CONFLICT DO NOTHING;
      `;
    })
  );
  return insertedComments;
}

// --- Seed Responses ---
async function seedResponses() {
  await sql`
    CREATE TABLE IF NOT EXISTS response (
      response_id SERIAL PRIMARY KEY,
      comment_id INT REFERENCES comment(comment_id) ON DELETE CASCADE,
      answerer INT REFERENCES "user"(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedResponses = await Promise.all(
    responses.map(async (r) => {
      return sql`
        INSERT INTO response (comment_id, answerer, content)
        VALUES (${r.comment_id}, ${r.answerer}, ${r.content})
      `;
    })
  );
  return insertedResponses;
}

// --- Seed Product Types ---
async function seedProductTypes() {
  await sql`
    CREATE TABLE IF NOT EXISTS product_type (
      product_type_id SERIAL PRIMARY KEY,
      product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
      type VARCHAR(100) NOT NULL,
      original_price INTEGER NOT NULL,
      discount_price INTEGER,
      stock INTEGER DEFAULT 0,
      UNIQUE (product_id, type)  -- ✅ ensures ON CONFLICT (product_id, type) works
    );
  `;

  const insertedProductTypes = await Promise.all(
    productTypes.map(async (pt) => {
      const prod = await sql`SELECT product_id FROM product WHERE name = ${pt.product_name} LIMIT 1`;
      return sql`
        INSERT INTO product_type (product_id, type, original_price, discount_price, stock)
        VALUES (${prod[0]?.product_id}, ${pt.type}, ${pt.original_price}, ${pt.discount_price}, ${pt.stock})
        ON CONFLICT (product_id, type) DO NOTHING;
      `;
    })
  );
  return insertedProductTypes;
}

// --- Seed Carts ---
async function seedCarts() {
  await sql`
    CREATE TABLE IF NOT EXISTS cart (
      user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
      product_type_id INT REFERENCES product_type(product_type_id) ON DELETE CASCADE,
      quantity INT NOT NULL CHECK (quantity = 1) DEFAULT 1,
      PRIMARY KEY (user_id, product_type_id)
    );
  `;
}

// --- Seed Orders ---
async function seedOrders() {
  await sql`
    CREATE TABLE IF NOT EXISTS order_owner (
      order_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
      state VARCHAR(30) CHECK (state IN ('pending', 'cancelled', 'completed')) DEFAULT 'pending',
      payment_method VARCHAR(7) CHECK (payment_method IN ('momo', 'vnpay', 'vietqr')) NOT NULL,
      total_val INTEGER,
      qr_url TEXT,
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      final_state_time TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "order" (
      order_id INT REFERENCES order_owner(order_id) ON DELETE CASCADE,
      product_type_id INT REFERENCES product_type(product_type_id) ON DELETE SET NULL,
      quantity INT NOT NULL CHECK (quantity = 1) DEFAULT 1,
      PRIMARY KEY (order_id, product_type_id)
    );
  `;
}

// --- MAIN SEED ROUTE ---
export async function GET() {
  try {
    console.log("Seeding users...");
    await seedUsers();

    console.log("Seeding categories...");
    await seedCategories();

    console.log("Seeding products...");
    await seedProducts();

    console.log("Seeding comments...");
    await seedComments();

    console.log("Seeding responses...");
    await seedResponses();

    console.log("Seeding product types...");
    await seedProductTypes();

    console.log("Seeding carts...");
    await seedCarts();

    console.log("Seeding orders...");
    await seedOrders();

    return NextResponse.json({ message: 'Digishop database seeded successfully' });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
