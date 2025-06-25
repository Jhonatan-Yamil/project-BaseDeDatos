require("dotenv").config({path: "../.env"});
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
  const hashKey = "vp_package";
  const field = id.toString();

  const cached = await redis.hGet(hashKey, field);
  if (cached) return JSON.parse(cached);

  const [rows] = await db.query("SELECT * FROM vp_packages WHERE id = ?", [id]);
  const data = rows[0];

  if (data) {
    await redis.hSet(hashKey, field, JSON.stringify(data));
    const ttl = await redis.ttl(hashKey);
    if (ttl === -1) await redis.expire(hashKey, 21600);
  }

  return data;
};

const getWalletBalance = async (userId) => {
  const key = `wallet_balance:${userId}`;
  const cached = await redis.get(key);
  if (cached) return parseFloat(cached);

  const [rows] = await db.query("SELECT balance FROM wallets WHERE user_id = ?", [userId]);
  const balance = rows[0]?.balance || 0;
  await redis.setEx(key, 60, balance.toString());
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
    await redis.expire(key, 86400);
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

// 🔸 Test
(async () => {
  console.log("VP Package:", await getVpPackage(1));
  console.log("Wallet Balance:", await getWalletBalance(5));
  console.log("Payment Methods:", await getPaymentMethods());
  console.log("Rank Levels:", await getRankLevels());
})();
