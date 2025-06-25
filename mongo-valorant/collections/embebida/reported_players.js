db.createCollection("reported_players");
{
  "bsonType": "object",
  "required": ["reported_player_id", "reports"],
  "properties": {
    "reported_player_id": {
      "bsonType": "int",
      "description": "ID del jugador reportado"
    },
    "reports": {
      "bsonType": "array",
      "description": "Lista de reportes en contra del jugador",
      "items": {
        "bsonType": "object",
        "required": ["reporter_id", "reason", "timestamp", "evidence"],
        "properties": {
          "reporter_id": {
            "bsonType": "int",
            "description": "ID del jugador que reporta"
          },
          "reason": {
            "bsonType": "string",
            "enum": ["cheating", "toxic behavior", "griefing", "afk", "other"],
            "description": "Motivo del reporte"
          },
          "timestamp": {
            "bsonType": "date",
            "description": "Fecha y hora del reporte"
          },
          "evidence": {
            "bsonType": "string",
            "description": "Archivo adjunto como evidencia"
          }
        }
      }
    }
  }
}

// Inserción de ejemplo
db.reported_players.insertMany([
  {
    reported_player_id: 501,
    reports: [
      {
        reporter_id: 510,
        reason: "cheating",
        timestamp: ISODate("2025-06-16T18:00:00Z"),
        evidence: "clip_cheat_501.mp4"
      },
      {
        reporter_id: 511,
        reason: "toxic behavior",
        timestamp: ISODate("2025-06-16T18:05:00Z"),
        evidence: "chatlog_501.txt"
      }
    ]
  },
  {
    reported_player_id: 502,
    reports: [
      {
        reporter_id: 512,
        reason: "afk",
        timestamp: ISODate("2025-06-16T18:10:00Z"),
        evidence: "screenshot_afk_502.png"
      }
    ]
  },
  {
    reported_player_id: 503,
    reports: [
      {
        reporter_id: 513,
        reason: "cheating",
        timestamp: ISODate("2025-06-16T18:15:00Z"),
        evidence: "clip_cheat_503.mp4"
      }
    ]
  },
  {
    reported_player_id: 504,
    reports: [
      {
        reporter_id: 514,
        reason: "toxic behavior",
        timestamp: ISODate("2025-06-16T18:20:00Z"),
        evidence: "chatlog_504.txt"
      }
    ]
  },
  {
    reported_player_id: 505,
    reports: [
      {
        reporter_id: 515,
        reason: "griefing",
        timestamp: ISODate("2025-06-16T18:25:00Z"),
        evidence: "clip_grief_505.mp4"
      }
    ]
  },
  {
    reported_player_id: 506,
    reports: [
      {
        reporter_id: 516,
        reason: "cheating",
        timestamp: ISODate("2025-06-16T18:30:00Z"),
        evidence: "clip_cheat_506.mp4"
      }
    ]
  },
  {
    reported_player_id: 507,
    reports: [
      {
        reporter_id: 517,
        reason: "toxic behavior",
        timestamp: ISODate("2025-06-16T18:35:00Z"),
        evidence: "chatlog_507.txt"
      }
    ]
  },
  {
    reported_player_id: 508,
    reports: [
      {
        reporter_id: 518,
        reason: "afk",
        timestamp: ISODate("2025-06-16T18:40:00Z"),
        evidence: "screenshot_afk_508.png"
      }
    ]
  },
  {
    reported_player_id: 509,
    reports: [
      {
        reporter_id: 519,
        reason: "cheating",
        timestamp: ISODate("2025-06-16T18:45:00Z"),
        evidence: "clip_cheat_509.mp4"
      }
    ]
  },
  {
    reported_player_id: 510,
    reports: [
      {
        reporter_id: 520,
        reason: "toxic behavior",
        timestamp: ISODate("2025-06-16T18:50:00Z"),
        evidence: "chatlog_510.txt"
      }
    ]
  }
])