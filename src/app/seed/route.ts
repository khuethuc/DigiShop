// seed/route.ts
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { users, categories, products, productTypes } from '../lib/seed_data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS "User" (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      birthday DATE
    );
  `;

  return Promise.all(users.map(async (u) => {
    const hashed = await bcrypt.hash(u.password, 10);
    return sql`
      INSERT INTO "User" (full_name, email, password, birthday)
      VALUES (${u.full_name}, ${u.email}, ${hashed}, ${u.birthday})
      ON CONFLICT (email) DO NOTHING;
    `;
  }));
}

async function seedCategories() {
  await sql`
    CREATE TABLE IF NOT EXISTS Category (
      category_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );
  `;

  return Promise.all(categories.map(c =>
    sql`INSERT INTO Category (name) VALUES (${c.name}) ON CONFLICT (name) DO NOTHING;`
  ));
}

async function seedProducts() {
  await sql`
    CREATE TABLE IF NOT EXISTS Product (
      product_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category_id INT REFERENCES Category(category_id) ON DELETE SET NULL,
      image_url VARCHAR(255)
    );
  `;

  return Promise.all(products.map(async (p) => {
    const cat = await sql`SELECT category_id FROM Category WHERE name=${p.category_name} LIMIT 1`;
    return sql`
      INSERT INTO Product (name, category_id, image_url)
      VALUES (${p.name}, ${cat[0]?.category_id}, ${p.image_url})
      ON CONFLICT (name) DO NOTHING;
    `;
  }));
}

async function seedProductTypes() {
  await sql`
    CREATE TABLE IF NOT EXISTS Product_Type (
      product_type_id SERIAL PRIMARY KEY,
      product_id INT REFERENCES Product(product_id) ON DELETE CASCADE,
      type VARCHAR(100) NOT NULL,
      original_price DECIMAL(10,2) NOT NULL,
      discount_price DECIMAL(10,2),
      status VARCHAR(20) CHECK (status IN ('in stock', 'out of stock')) DEFAULT 'in stock'
    );
  `;

  return Promise.all(productTypes.map(async (pt) => {
    const prod = await sql`SELECT product_id FROM Product WHERE name=${pt.product_name} LIMIT 1`;
    return sql`
      INSERT INTO Product_Type (product_id, type, original_price, discount_price, status)
      VALUES (${prod[0]?.product_id}, ${pt.type}, ${pt.original_price}, ${pt.discount_price}, ${pt.status})
      ON CONFLICT (product_id, type) DO NOTHING;
    `;
  }));
}

async function seedCarts() {
  await sql`
    CREATE TABLE IF NOT EXISTS Cart (
      cart_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES "User"(id) ON DELETE CASCADE
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS Cart_Owner (
      cart_owner_id SERIAL PRIMARY KEY,
      cart_id INT REFERENCES Cart(cart_id) ON DELETE CASCADE,
      user_id INT REFERENCES "User"(id) ON DELETE CASCADE
    );
  `;

  const allUsers = await sql`SELECT id FROM "User"`;
  return Promise.all(allUsers.map(u =>
    sql`INSERT INTO Cart (user_id) VALUES (${u.id}) ON CONFLICT DO NOTHING;`
  ));
}

async function seedOrders() {
  await sql`
    CREATE TABLE IF NOT EXISTS "Order" (
      order_id SERIAL PRIMARY KEY,
      product_type_id INT REFERENCES Product_Type(product_type_id) ON DELETE SET NULL,
      count INT NOT NULL CHECK (count > 0),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS Order_Owner (
      order_owner_id SERIAL PRIMARY KEY,
      order_id INT REFERENCES "Order"(order_id) ON DELETE CASCADE,
      user_id INT REFERENCES "User"(id) ON DELETE CASCADE,
      state VARCHAR(30) CHECK (state IN ('pending', 'cancelled', 'completed')) DEFAULT 'pending',
      payment_method VARCHAR(50),
      total_val DECIMAL(10,2),
      final_state_time TIMESTAMP
    );
  `;

  const allUsers = await sql`SELECT id FROM "User"`;
  const allTypes = await sql`SELECT product_type_id, original_price, discount_price FROM Product_Type`;

  return Promise.all(allUsers.map(async (user) => {
    const type = allTypes[Math.floor(Math.random() * allTypes.length)];
    const count = Math.floor(Math.random() * 3) + 1;
    const total = count * (type.discount_price || type.original_price);

    const order = await sql`
      INSERT INTO "Order" (product_type_id, count)
      VALUES (${type.product_type_id}, ${count})
      RETURNING order_id;
    `;

    return sql`
      INSERT INTO Order_Owner (order_id, user_id, state, payment_method, total_val, final_state_time)
      VALUES (${order[0].order_id}, ${user.id}, 'completed', 'credit card', ${total}, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING;
    `;
  }));
}

// --- MAIN ---
export async function GET() {
  try {
    await sql.begin(async (sql) => [
      seedUsers(),
      seedCategories(),
      seedProducts(),
      seedProductTypes(),
      seedCarts(),
      seedOrders(),
    ]);

    return Response.json({ message: 'Digishop database seeded successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}