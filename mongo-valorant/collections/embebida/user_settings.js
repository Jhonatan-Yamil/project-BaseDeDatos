db.createCollection("user_settings");

{
  "bsonType": "object",
  "required": ["player_id", "settings"],
  "properties": {
    "player_id": {
      "bsonType": "int",
      "description": "ID del jugador"
    },
    "settings": {
      "bsonType": "object",
      "required": ["language", "graphics", "notifications"],
      "properties": {
        "language": {
          "bsonType": "string",
          "description": "Idioma preferido",
          "enum": ["en", "es", "fr", "de", "pt", "it"]
        },
        "graphics": {
          "bsonType": "object",
          "required": ["quality", "fullscreen"],
          "properties": {
            "quality": {
              "bsonType": "string",
              "enum": ["low", "medium", "high"],
              "description": "Calidad gráfica"
            },
            "fullscreen": {
              "bsonType": "bool",
              "description": "Modo pantalla completa"
            }
          }
        },
        "notifications": {
          "bsonType": "object",
          "required": ["email", "in_game"],
          "properties": {
            "email": {
              "bsonType": "bool",
              "description": "Recibir notificaciones por correo"
            },
            "in_game": {
              "bsonType": "bool",
              "description": "Recibir notificaciones en el juego"
            }
          }
        }
      }
    }
  }
}

// Inserción de ejemplo
db.user_settings.insertMany([
  {
    player_id: 501,
    settings: {
      language: "en",
      graphics: { quality: "high", fullscreen: true },
      notifications: { email: false, in_game: true }
    }
  },
  {
    player_id: 502,
    settings: {
      language: "es",
      graphics: { quality: "medium", fullscreen: false },
      notifications: { email: true, in_game: true }
    }
  },
  {
    player_id: 503,
    settings: {
      language: "fr",
      graphics: { quality: "low", fullscreen: true },
      notifications: { email: false, in_game: false }
    }
  },
  {
    player_id: 504,
    settings: {
      language: "de",
      graphics: { quality: "ultra", fullscreen: true },
      notifications: { email: true, in_game: false }
    }
  },
  {
    player_id: 505,
    settings: {
      language: "pt",
      graphics: { quality: "medium", fullscreen: true },
      notifications: { email: false, in_game: true }
    }
  },
  {
    player_id: 506,
    settings: {
      language: "en",
      graphics: { quality: "high", fullscreen: false },
      notifications: { email: true, in_game: true }
    }
  },
  {
    player_id: 507,
    settings: {
      language: "es",
      graphics: { quality: "low", fullscreen: false },
      notifications: { email: false, in_game: false }
    }
  },
  {
    player_id: 508,
    settings: {
      language: "en",
      graphics: { quality: "ultra", fullscreen: true },
      notifications: { email: true, in_game: true }
    }
  },
  {
    player_id: 509,
    settings: {
      language: "fr",
      graphics: { quality: "medium", fullscreen: false },
      notifications: { email: false, in_game: true }
    }
  },
  {
    player_id: 510,
    settings: {
      language: "de",
      graphics: { quality: "high", fullscreen: true },
      notifications: { email: true, in_game: false }
    }
  }
])