db.createCollection("match_chat_logs");

{
  "bsonType": "object",
  "required": ["match_id"],
  "properties": {
    "match_id": {
      "bsonType": "int",
      "description": "ID único del partido"
    },
    "messages": {
      "bsonType": "array",
      "description": "Lista de mensajes enviados (opcional)",
      "items": {
        "bsonType": "object",
        "required": ["timestamp", "player_id", "message"],
        "properties": {
          "timestamp": {
            "bsonType": "date",
            "description": "Fecha y hora del mensaje"
          },
          "player_id": {
            "bsonType": "int",
            "description": "ID del jugador que envió el mensaje"
          },
          "message": {
            "bsonType": "string",
            "description": "Contenido del mensaje",
            "maxLength": 500
          }
        }
      }
    }
  }
}

// Inserción de ejemplo
db.match_chat_logs.insertMany([
  {
    match_id: 1,
    messages: [
      { timestamp: ISODate("2025-06-16T18:45:00Z"), player_id: 501, message: "Let's go A!" },
      { timestamp: ISODate("2025-06-16T18:45:05Z"), player_id: 502, message: "Roger that." }
    ]
  },
  {
    match_id: 2,
    messages: [
      { timestamp: ISODate("2025-06-16T19:10:00Z"), player_id: 510, message: "Plant B, fast!" },
      { timestamp: ISODate("2025-06-16T19:10:07Z"), player_id: 512, message: "Cover me!" }
    ]
  },
  {
    match_id: 3,
    messages: [
      { timestamp: ISODate("2025-06-16T20:00:00Z"), player_id: 520, message: "Enemy spotted mid." }
    ]
  },
  {
    match_id: 4,
    messages: [
      { timestamp: ISODate("2025-06-16T20:10:00Z"), player_id: 530, message: "I'm lagging :(" },
      { timestamp: ISODate("2025-06-16T20:10:10Z"), player_id: 531, message: "Reloading..." }
    ]
  },
  {
    match_id: 5,
    messages: [
      { timestamp: ISODate("2025-06-16T20:20:00Z"), player_id: 540, message: "Nice clutch!" }
    ]
  },
  {
    match_id: 6,
    messages: [
      { timestamp: ISODate("2025-06-16T20:30:00Z"), player_id: 550, message: "They're pushing A." },
      { timestamp: ISODate("2025-06-16T20:30:05Z"), player_id: 551, message: "Rotate!" }
    ]
  },
  {
    match_id: 7,
    messages: [
      { timestamp: ISODate("2025-06-16T20:40:00Z"), player_id: 560, message: "Spike down mid." }
    ]
  },
  {
    match_id: 8,
    messages: [
      { timestamp: ISODate("2025-06-16T20:50:00Z"), player_id: 570, message: "Use your ult!" }
    ]
  },
  {
    match_id: 9,
    messages: [
      { timestamp: ISODate("2025-06-16T21:00:00Z"), player_id: 580, message: "I'm low HP." },
      { timestamp: ISODate("2025-06-16T21:00:03Z"), player_id: 581, message: "I'll heal you." }
    ]
  },
  {
    match_id: 10,
    messages: [
      { timestamp: ISODate("2025-06-16T21:10:00Z"), player_id: 590, message: "GG WP!" }
    ]
  }
])
