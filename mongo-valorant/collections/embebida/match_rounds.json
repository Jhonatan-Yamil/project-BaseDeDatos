db.createCollection("match_rounds");
{
  "_id": ObjectId,
  "match_id": ObjectId,
  "rounds": [
    {
      "round_number": 1,
      "winning_team": ObjectId,
      "losing_team": ObjectId,
      "plant_site": "A",
      "spike_planted": true,
      "duration_seconds": 45
    }
  ]
}

// Inserción de ejemplo
db.match_rounds.insertMany([
  {
    match_id: 1,
    rounds: [
      {
        round_number: 1,
        winning_team: 101,
        losing_team: 102,
        plant_site: "A",
        spike_planted: true,
        duration_seconds: 45
      },
      {
        round_number: 2,
        winning_team: 102,
        losing_team: 101,
        plant_site: "B",
        spike_planted: false,
        duration_seconds: 50
      }
    ]
  },
  {
    match_id: 2,
    rounds: [
      {
        round_number: 1,
        winning_team: 103,
        losing_team: 104,
        plant_site: "A",
        spike_planted: true,
        duration_seconds: 42
      }
    ]
  },
  {
    match_id: 3,
    rounds: [
      {
        round_number: 1,
        winning_team: 105,
        losing_team: 106,
        plant_site: "B",
        spike_planted: true,
        duration_seconds: 38
      },
      {
        round_number: 2,
        winning_team: 105,
        losing_team: 106,
        plant_site: "A",
        spike_planted: true,
        duration_seconds: 52
      },
      {
        round_number: 3,
        winning_team: 106,
        losing_team: 105,
        plant_site: "B",
        spike_planted: false,
        duration_seconds: 40
      }
    ]
  },
  {
    match_id: 4,
    rounds: [
      {
        round_number: 1,
        winning_team: 107,
        losing_team: 108,
        plant_site: "A",
        spike_planted: false,
        duration_seconds: 35
      }
    ]
  },
  {
    match_id: 5,
    rounds: [
      {
        round_number: 1,
        winning_team: 109,
        losing_team: 110,
        plant_site: "B",
        spike_planted: true,
        duration_seconds: 48
      },
      {
        round_number: 2,
        winning_team: 109,
        losing_team: 110,
        plant_site: "B",
        spike_planted: true,
        duration_seconds: 43
      }
    ]
  },
  {
    match_id: 6,
    rounds: [
      {
        round_number: 1,
        winning_team: 111,
        losing_team: 112,
        plant_site: "A",
        spike_planted: false,
        duration_seconds: 39
      }
    ]
  },
  {
    match_id: 7,
    rounds: [
      {
        round_number: 1,
        winning_team: 113,
        losing_team: 114,
        plant_site: "A",
        spike_planted: true,
        duration_seconds: 46
      }
    ]
  },
  {
    match_id: 8,
    rounds: [
      {
        round_number: 1,
        winning_team: 115,
        losing_team: 116,
        plant_site: "B",
        spike_planted: true,
        duration_seconds: 47
      },
      {
        round_number: 2,
        winning_team: 116,
        losing_team: 115,
        plant_site: "A",
        spike_planted: false,
        duration_seconds: 41
      }
    ]
  },
  {
    match_id: 9,
    rounds: [
      {
        round_number: 1,
        winning_team: 117,
        losing_team: 118,
        plant_site: "A",
        spike_planted: true,
        duration_seconds: 44
      }
    ]
  },
  {
    match_id: 10,
    rounds: [
      {
        round_number: 1,
        winning_team: 119,
        losing_team: 120,
        plant_site: "B",
        spike_planted: true,
        duration_seconds: 40
      }
    ]
  }
])

