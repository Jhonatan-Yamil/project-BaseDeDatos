db.createCollection("player_round_stats");
{
  "bsonType": "object",
  "required": ["match_id", "round_number", "player_id", "team_id", "kills", "deaths", "headshots", "damage"],
  "properties": {
    "match_id": {
      "bsonType": "int",
      "description": "ID del partido"
    },
    "round_number": {
      "bsonType": "int",
      "description": "Número de la ronda"
    },
    "player_id": {
      "bsonType": "int",
      "description": "ID del jugador"
    },
    "team_id": {
      "bsonType": "int",
      "description": "ID del equipo del jugador"
    },
    "kills": {
      "bsonType": "int",
      "minimum": 0,
      "description": "Cantidad de bajas del jugador en esta ronda"
    },
    "deaths": {
      "bsonType": "int",
      "minimum": 0,
      "description": "Cantidad de muertes del jugador en esta ronda"
    },
    "headshots": {
      "bsonType": "int",
      "minimum": 0,
      "description": "Cantidad de tiros a la cabeza"
    },
    "damage": {
      "bsonType": "int",
      "minimum": 0,
      "description": "Cantidad de daño causado"
    }
  }
}


// Inserción de ejemplo
db.player_round_stats.insertMany([
  {
    match_id: 1,
    round_number: 1,
    player_id: 501,
    team_id: 101,
    kills: 2,
    deaths: 1,
    headshots: 1,
    damage: 150
  },
  {
    match_id: 1,
    round_number: 1,
    player_id: 502,
    team_id: 101,
    kills: 1,
    deaths: 1,
    headshots: 0,
    damage: 80
  },
  {
    match_id: 1,
    round_number: 1,
    player_id: 503,
    team_id: 102,
    kills: 0,
    deaths: 1,
    headshots: 0,
    damage: 30
  },
  {
    match_id: 1,
    round_number: 2,
    player_id: 504,
    team_id: 102,
    kills: 3,
    deaths: 0,
    headshots: 2,
    damage: 200
  },
  {
    match_id: 2,
    round_number: 1,
    player_id: 505,
    team_id: 103,
    kills: 1,
    deaths: 1,
    headshots: 1,
    damage: 110
  },
  {
    match_id: 2,
    round_number: 1,
    player_id: 506,
    team_id: 104,
    kills: 2,
    deaths: 2,
    headshots: 2,
    damage: 190
  },
  {
    match_id: 3,
    round_number: 3,
    player_id: 507,
    team_id: 105,
    kills: 0,
    deaths: 1,
    headshots: 0,
    damage: 25
  },
  {
    match_id: 3,
    round_number: 3,
    player_id: 508,
    team_id: 106,
    kills: 2,
    deaths: 0,
    headshots: 1,
    damage: 170
  },
  {
    match_id: 4,
    round_number: 1,
    player_id: 509,
    team_id: 107,
    kills: 1,
    deaths: 0,
    headshots: 1,
    damage: 95
  },
  {
    match_id: 5,
    round_number: 2,
    player_id: 510,
    team_id: 110,
    kills: 3,
    deaths: 1,
    headshots: 2,
    damage: 210
  }
])