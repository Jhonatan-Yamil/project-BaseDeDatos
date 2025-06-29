db.createCollection("leaderboards_snapshots");

{
  "bsonType": "object",
  "required": ["snapshot_date", "players"],
  "properties": {
    "snapshot_date": {
      "bsonType": "date",
      "description": "Fecha del snapshot del leaderboard"
    },
    "players": {
      "bsonType": "array",
      "items": {
        "bsonType": "object",
        "required": ["player_id", "rank", "kills", "deaths", "matches_played"],
        "properties": {
          "player_id": {
            "bsonType": "int",
            "description": "ID único del jugador"
          },
          "rank": {
            "bsonType": "int",
            "description": "Ranking del jugador en el snapshot"
          },
          "kills": {
            "bsonType": "int",
            "description": "Cantidad de asesinatos del jugador"
          },
          "deaths": {
            "bsonType": "int",
            "description": "Cantidad de muertes del jugador"
          },
          "matches_played": {
            "bsonType": "int",
            "description": "Cantidad de partidas jugadas"
          }
        }
      }
    }
  }
}


// Inserción de ejemplo
db.leaderboards_snapshots.insertMany([
  {
    snapshot_date: ISODate("2025-06-10T00:00:00Z"),
    players: [
      { player_id: 501, rank: 1, kills: 130, deaths: 50, matches_played: 20 },
      { player_id: 502, rank: 2, kills: 120, deaths: 60, matches_played: 19 },
      { player_id: 503, rank: 3, kills: 110, deaths: 55, matches_played: 18 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-11T00:00:00Z"),
    players: [
      { player_id: 504, rank: 1, kills: 140, deaths: 45, matches_played: 21 },
      { player_id: 505, rank: 2, kills: 125, deaths: 65, matches_played: 20 },
      { player_id: 506, rank: 3, kills: 115, deaths: 58, matches_played: 19 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-12T00:00:00Z"),
    players: [
      { player_id: 507, rank: 1, kills: 135, deaths: 52, matches_played: 22 },
      { player_id: 508, rank: 2, kills: 128, deaths: 60, matches_played: 21 },
      { player_id: 509, rank: 3, kills: 118, deaths: 59, matches_played: 20 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-13T00:00:00Z"),
    players: [
      { player_id: 510, rank: 1, kills: 150, deaths: 48, matches_played: 23 },
      { player_id: 511, rank: 2, kills: 132, deaths: 62, matches_played: 22 },
      { player_id: 512, rank: 3, kills: 120, deaths: 61, matches_played: 21 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-14T00:00:00Z"),
    players: [
      { player_id: 513, rank: 1, kills: 145, deaths: 49, matches_played: 24 },
      { player_id: 514, rank: 2, kills: 130, deaths: 63, matches_played: 23 },
      { player_id: 515, rank: 3, kills: 122, deaths: 60, matches_played: 22 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-15T00:00:00Z"),
    players: [
      { player_id: 516, rank: 1, kills: 155, deaths: 47, matches_played: 25 },
      { player_id: 517, rank: 2, kills: 135, deaths: 65, matches_played: 24 },
      { player_id: 518, rank: 3, kills: 125, deaths: 62, matches_played: 23 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-16T00:00:00Z"),
    players: [
      { player_id: 519, rank: 1, kills: 160, deaths: 46, matches_played: 26 },
      { player_id: 520, rank: 2, kills: 138, deaths: 66, matches_played: 25 },
      { player_id: 521, rank: 3, kills: 128, deaths: 63, matches_played: 24 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-17T00:00:00Z"),
    players: [
      { player_id: 522, rank: 1, kills: 165, deaths: 44, matches_played: 27 },
      { player_id: 523, rank: 2, kills: 140, deaths: 67, matches_played: 26 },
      { player_id: 524, rank: 3, kills: 130, deaths: 64, matches_played: 25 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-18T00:00:00Z"),
    players: [
      { player_id: 525, rank: 1, kills: 170, deaths: 43, matches_played: 28 },
      { player_id: 526, rank: 2, kills: 142, deaths: 68, matches_played: 27 },
      { player_id: 527, rank: 3, kills: 132, deaths: 65, matches_played: 26 }
    ]
  },
  {
    snapshot_date: ISODate("2025-06-19T00:00:00Z"),
    players: [
      { player_id: 528, rank: 1, kills: 175, deaths: 42, matches_played: 29 },
      { player_id: 529, rank: 2, kills: 145, deaths: 69, matches_played: 28 },
      { player_id: 530, rank: 3, kills: 135, deaths: 66, matches_played: 27 }
    ]
  }
]);