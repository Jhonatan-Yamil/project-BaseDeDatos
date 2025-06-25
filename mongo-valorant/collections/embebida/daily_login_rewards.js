db.createCollection("daily_login_rewards");

{
  "type": "object",
  "properties": {
    "player_id": { "type": "number" },
    "rewards": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": { "type": "string", "format": "date" },
          "vp_rewarded": { "type": "number" }
        },
        "required": ["date", "vp_rewarded"]
      }
    }
  },
  "required": ["player_id", "rewards"]
}

// Inserción de ejemplo
db.daily_login_rewards.insertMany([
  {
    player_id: 501,
    rewards: [
      { date: "2025-06-14", vp_rewarded: 150 },
      { date: "2025-06-15", vp_rewarded: 300 }
    ]
  },
  {
    player_id: 502,
    rewards: [
      { date: "2025-06-14", vp_rewarded: 100 },
      { date: "2025-06-15", vp_rewarded: 200 }
    ]
  },
  {
    player_id: 503,
    rewards: [
      { date: "2025-06-13", vp_rewarded: 120 },
      { date: "2025-06-14", vp_rewarded: 250 }
    ]
  },
  {
    player_id: 504,
    rewards: [
      { date: "2025-06-12", vp_rewarded: 180 },
      { date: "2025-06-13", vp_rewarded: 220 }
    ]
  },
  {
    player_id: 505,
    rewards: [
      { date: "2025-06-11", vp_rewarded: 130 },
      { date: "2025-06-12", vp_rewarded: 270 }
    ]
  },
  {
    player_id: 506,
    rewards: [
      { date: "2025-06-10", vp_rewarded: 160 },
      { date: "2025-06-11", vp_rewarded: 210 }
    ]
  },
  {
    player_id: 507,
    rewards: [
      { date: "2025-06-09", vp_rewarded: 140 },
      { date: "2025-06-10", vp_rewarded: 230 }
    ]
  },
  {
    player_id: 508,
    rewards: [
      { date: "2025-06-08", vp_rewarded: 170 },
      { date: "2025-06-09", vp_rewarded: 260 }
    ]
  },
  {
    player_id: 509,
    rewards: [
      { date: "2025-06-07", vp_rewarded: 110 },
      { date: "2025-06-08", vp_rewarded: 240 }
    ]
  },
  {
    player_id: 510,
    rewards: [
      { date: "2025-06-06", vp_rewarded: 190 },
      { date: "2025-06-07", vp_rewarded: 280 }
    ]
  }
])