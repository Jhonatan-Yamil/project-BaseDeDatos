require("dotenv").config({path: "../.env"});
const { createClient } = require("redis");
const mysql = require("mysql2/promise");
const { Pool } = require("pg");

// PostgreSQL Pool
const pg = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
});

// MySQL Pool
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

// Redis Client
const redis = createClient({ url: process.env.REDIS_URL });

redis.on("connect", () => console.log("🔗 Redis connected successfully!"));
redis.on("error", (err) => console.error("❌ Redis connection error:", err));
redis.connect().catch(console.error);

// 🔹 VP Package (Hash, TTL 6h)
const getVpPackage = async (id) => {
  const key = `vp_package:${id}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const [rows] = await db.query("SELECT * FROM vp_packages WHERE id = ?", [id]);
  const data = rows[0];
  if (data) await redis.setEx(key, 21600, JSON.stringify(data)); // 6h
  return data;
};

// 🔹 Wallet Balance (String, TTL 6h)
const getWalletBalance = async (userId) => {
  const key = `wallet_balance:${userId}`;
  const cached = await redis.get(key);
  if (cached) return parseFloat(cached);

  const [rows] = await db.query("SELECT balance FROM wallets WHERE user_id = ?", [userId]);
  const balance = rows[0]?.balance || 0;
  await redis.setEx(key, 21600, balance.toString()); // 6h
  return balance;
};

// 🔹 Payment Methods (Set, TTL 24h)
const getPaymentMethods = async () => {
  const key = "payment_methods";
  const exists = await redis.exists(key);
  if (exists) return await redis.sMembers(key);

  const [rows] = await db.query("SELECT method_name FROM payment_methods");
  const methods = rows.map((r) => r.method_name);
  if (methods.length > 0) {
    await redis.sAdd(key, ...methods);
    await redis.expire(key, 86400); // 24h
  }
  return methods;
};

// 🔹 Rank Levels (Sorted Set, TTL 24h)
const getRankLevels = async () => {
  const key = "rank_levels";
  const exists = await redis.exists(key);
  if (exists) return await redis.zRangeWithScores(key, 0, -1);

  const result = await pg.query("SELECT rank_name, rank_order FROM rank_levels");
  const rows = result.rows;
  if (rows.length > 0) {
    await redis.zAdd(key, rows.map(r => ({ score: r.rank_order, value: r.rank_name })));
    await redis.expire(key, 86400); // 24h
  }
  return rows;
};

// 🔹 Players by Country (Set, TTL 1h)
const getPlayersByCountry = async (countryCode) => {
  const key = `players:by_country:${countryCode}`;
  const exists = await redis.exists(key);
  if (exists) return await redis.sMembers(key);

  const result = await pg.query(`
    SELECT players.id 
    FROM players 
    JOIN country ON players.country = country.id 
    WHERE country.code = $1
  `, [countryCode]);

  const ids = result.rows.map(r => r.id.toString());
  if (ids.length > 0) {
    await redis.sAdd(key, ...ids);
    await redis.expire(key, 3600); // 1h
  }
  return ids;
};

// 🔸 Test Execution]
(async () => {
  try {
    console.log("VP Package:", await getVpPackage(1));
    console.log("Wallet Balance:", await getWalletBalance(5));
    console.log("Payment Methods:", await getPaymentMethods());
    console.log("Rank Levels:", await getRankLevels());
    console.log("Players (Bo):", await getPlayersByCountry("BO"));
  } catch (err) {
    console.error("❌ Error in execution:", err);
  } finally {
    await redis.disconnect();
    await pg.end();
    db.end(); // mysql2 pool doesn't need await
  }
})();
