const postgres = require("postgres");

const sqlMain = postgres(
  "postgres://luis:123456789@localhost:5432/valorant_gameplay_db",
  {
    host: "localhost",
    port: 5432,
    database: "valorant_gameplay_db",
    username: "luis",
    password: "123456789",
  }
);

const sqlLA = postgres(
  "postgres://luis:123456789@localhost:5433/valorant_gameplay_db",
  {
    host: "localhost",
    port: 5433,
    database: "valorant_gameplay_db",
    username: "luis",
    password: "123456789",
  }
);

const sqlEU = postgres(
  "postgres://luis:123456789@localhost:5434/valorant_gameplay_db",
  {
    host: "localhost",
    port: 5434,
    database: "valorant_gameplay_db",
    username: "luis",
    password: "123456789",
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
