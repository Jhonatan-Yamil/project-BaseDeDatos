db.createCollection("reported_players");

{
  "reported_player_id": ObjectId,
  "reports": [
    {
      "reporter_id": ObjectId,
      "reason": "cheating",
      "timestamp": ISODate("2025-06-15T16:00:00Z"),
      "evidence": "clip123.mp4"
    }
  ]
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