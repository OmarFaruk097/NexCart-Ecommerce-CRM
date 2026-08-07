const { Pool } = require('pg');
require('dotenv').config();

let pool;
let dbReady = false;
let initPromise = null;

const buildPool = async () => {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  return pool;
};

const initDb = async () => {
  if (dbReady) {
    return pool;
  }

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const poolInstance = await buildPool();
        const client = await poolInstance.connect();

        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            token VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255),
            description TEXT,
            imageUrl VARCHAR(500),
            stock INT DEFAULT 0
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(255) PRIMARY KEY,
            user_id INT,
            total DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'Processing',
            shipping_name VARCHAR(255),
            shipping_address VARCHAR(255),
            shipping_city VARCHAR(255),
            shipping_zip VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id VARCHAR(255),
            product_name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            quantity INT NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS support_tickets (
            id VARCHAR(255) PRIMARY KEY,
            user_name VARCHAR(255),
            subject VARCHAR(255),
            message TEXT,
            status VARCHAR(50) DEFAULT 'Open',
            priority VARCHAR(50) DEFAULT 'Medium',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        client.release();
        dbReady = true;
        console.log('Database tables initialized.');
        return poolInstance;
      } catch (error) {
        console.warn('Database initialization skipped:', error.message);
        return null;
      }
    })();
  }

  return initPromise;
};

module.exports = {
  get pool() {
    if (!pool) {
      throw new Error('Database pool has not been initialized yet!');
    }
    return pool;
  },
  initDb
};
