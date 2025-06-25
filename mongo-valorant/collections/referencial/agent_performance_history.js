db.createCollection("agent_performance_history");

{
  "bsonType": "object",
  "required": ["player_id", "agent"],
  "properties": {
    "player_id": {
      "bsonType": "int",
      "description": "ID del jugador"
    },
    "agent": {
      "bsonType": "string",
      "description": "Nombre del agente usado por el jugador"
    },
    "performance": {
      "bsonType": "array",
      "description": "Rendimiento del jugador con este agente",
      "items": {
        "bsonType": "object",
        "required": ["match_id", "kills", "deaths", "assists"],
        "properties": {
          "match_id": {
            "bsonType": "int",
            "description": "ID de la partida"
          },
          "kills": {
            "bsonType": "int",
            "minimum": 0,
            "description": "Número de asesinatos"
          },
          "deaths": {
            "bsonType": "int",
            "minimum": 0,
            "description": "Número de muertes"
          },
          "assists": {
            "bsonType": "int",
            "minimum": 0,
            "description": "Número de asistencias"
          }
        }
      }
    }
  }
}

// Inserción de ejemplo
db.agent_performance_history.insertMany([
  {
    player_id: 501,
    agent: "Jett",
    performance: [
      { match_id: 1, kills: 15, deaths: 10, assists: 3 },
      { match_id: 2, kills: 12, deaths: 8, assists: 4 }
    ]
  },
  {
    player_id: 502,
    agent: "Phoenix",
    performance: [
      { match_id: 1, kills: 10, deaths: 12, assists: 2 },
      { match_id: 3, kills: 14, deaths: 9, assists: 5 }
    ]
  },
  {
    player_id: 503,
    agent: "Sage",
    performance: [
      { match_id: 2, kills: 8, deaths: 11, assists: 7 },
      { match_id: 4, kills: 11, deaths: 10, assists: 6 }
    ]
  },
  {
    player_id: 504,
    agent: "Omen",
    performance: [
      { match_id: 3, kills: 13, deaths: 9, assists: 4 },
      { match_id: 5, kills: 16, deaths: 8, assists: 3 }
    ]
  },
  {
    player_id: 505,
    agent: "Raze",
    performance: [
      { match_id: 4, kills: 17, deaths: 7, assists: 2 },
      { match_id: 6, kills: 15, deaths: 10, assists: 5 }
    ]
  },
  {
    player_id: 506,
    agent: "Killjoy",
    performance: [
      { match_id: 5, kills: 9, deaths: 13, assists: 6 },
      { match_id: 7, kills: 12, deaths: 11, assists: 4 }
    ]
  },
  {
    player_id: 507,
    agent: "Brimstone",
    performance: [
      { match_id: 6, kills: 11, deaths: 12, assists: 5 },
      { match_id: 8, kills: 13, deaths: 9, assists: 7 }
    ]
  },
  {
    player_id: 508,
    agent: "Sova",
    performance: [
      { match_id: 7, kills: 14, deaths: 8, assists: 6 },
      { match_id: 9, kills: 10, deaths: 12, assists: 3 }
    ]
  },
  {
    player_id: 509,
    agent: "Cypher",
    performance: [
      { match_id: 8, kills: 12, deaths: 10, assists: 5 },
      { match_id: 10, kills: 15, deaths: 7, assists: 4 }
    ]
  },
  {
    player_id: 510,
    agent: "Viper",
    performance: [
      { match_id: 9, kills: 13, deaths: 11, assists: 2 },
      { match_id: 11, kills: 16, deaths: 8, assists: 6 }
    ]
    }
]);