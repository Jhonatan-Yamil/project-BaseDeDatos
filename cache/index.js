require("dotenv").config();
const { createClient } = require("redis");
const mysql = require("mysql2/promise");

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

// 🔹 Wallet Balance (String, TTL 60s)
const getWalletBalance = async (userId) => {
  const key = `wallet_balance:${userId}`;
  const cached = await redis.get(key);
  if (cached) return parseFloat(cached);

  const [rows] = await db.query("SELECT balance FROM wallets WHERE user_id = ?", [userId]);
  const balance = rows[0]?.balance || 0;
  await redis.setEx(key, 60, balance.toString()); // 60s
  return balance;
};

// 🔹 Payment Methods (Set, TTL 24h)
const getPaymentMethods = async () => {
  const key = "payment_methods";
  const exists = await redis.exists(key);
  if (exists) return await redis.sMembers(key);

  const [rows] = await db.query("SELECT name FROM payment_methods");
  const methods = rows.map((r) => r.name);
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

  const [rows] = await db.query("SELECT name, rank_order FROM rank_levels");
  if (rows.length > 0) {
    const members = rows.flatMap((r) => [r.rank_order, r.name]);
    await redis.zAdd(key, rows.map(r => ({ score: r.rank_order, value: r.name })));
    await redis.expire(key, 86400); // 24h
  }
  return rows;
};

// 🔹 Players by Country (Set, TTL 1h)
const getPlayersByCountry = async (countryCode) => {
  const key = `players:by_country:${countryCode}`;
  const exists = await redis.exists(key);
  if (exists) return await redis.sMembers(key);

  const [rows] = await db.query("SELECT id FROM players WHERE country_code = ?", [countryCode]);
  const ids = rows.map((r) => r.id.toString());
  if (ids.length > 0) {
    await redis.sAdd(key, ...ids);
    await redis.expire(key, 3600); // 1h
  }
  return ids;
};

// 🔸 Test
(async () => {
  console.log("VP Package:", await getVpPackage(1));
  console.log("Wallet Balance:", await getWalletBalance(5));
  console.log("Payment Methods:", await getPaymentMethods());
  console.log("Rank Levels:", await getRankLevels());
  console.log("Players (PE):", await getPlayersByCountry("PE"));
})();
