require("dotenv").config({ path: "../.env" });
const postgres = require("postgres");

const sqlMain = postgres(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
  {
    host: "localhost",
    port: 5432,
    database: "valorant_gameplay_db",
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  }
);

const sqlLA = postgres(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5436/${process.env.POSTGRES_DB}`,
  {
    host: "localhost",
    port: 5436,
    database: "valorant_gameplay_db",
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  }
);

const sqlEU = postgres(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5437/${process.env.POSTGRES_DB}`,
  {
    host: "localhost",
    port: 5437,
    database: "valorant_gameplay_db",
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  }
);

const REGIONS_LA = ['LA', 'NA', 'BR'];
const REGIONS_EU = ['EU', 'AP', 'KR'];

const insertPlayer = async (data) => {
  const { username, rank_id, level, country, regions } = data;

  let targetDb;

  if (REGIONS_LA.includes(regions)) {
    targetDb = sqlLA;
  } else if (REGIONS_EU.includes(regions)) {
    targetDb = sqlEU;
  }
  await targetDb`
    INSERT INTO players (username, rank_id, level, country, regions)
    VALUES (${username}, ${rank_id}, ${level}, ${country}, 
      (SELECT id FROM regions WHERE code = ${regions}))
  `;
  targetDb = sqlMain;
  await targetDb`
    INSERT INTO players (username, rank_id, level, country, regions)
    VALUES (${username}, ${rank_id}, ${level}, ${country}, 
      (SELECT id FROM regions WHERE code = ${regions}))
  `;
};

const player1 = {
  username: 'crimson',
  rank_id: 1,
  level: 20,
  country: 1,
  regions: 'LA',
};

const player2 = {
  username: 'ghost',
  rank_id: 2,
  level: 30,
  country: 2,
  regions: 'EU',
};


insertPlayer(player1);
insertPlayer(player2);
