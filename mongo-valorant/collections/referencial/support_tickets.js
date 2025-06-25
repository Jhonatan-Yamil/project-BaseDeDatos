db.createCollection("support_tickets");

{
  "bsonType": "object",
  "required": ["_id", "player_id", "issue_type", "status"],
  "properties": {
    "_id": {
      "bsonType": "objectId",
      "description": "Identificador único del reporte"
    },
    "player_id": {
      "bsonType": "objectId",
      "description": "ID del jugador que reporta"
    },
    "issue_type": {
      "bsonType": "string",
      "description": "Tipo de problema reportado",
      "enum": ["login_problem", "bug_report", "payment_issue", "other"]
    },
    "status": {
      "bsonType": "string",
      "description": "Estado del reporte",
      "enum": ["open", "closed", "in_progress", "resolved"]
    },
    "messages": {
      "bsonType": "array",
      "description": "Mensajes del reporte",
      "items": {
        "bsonType": "object",
        "required": ["timestamp", "sender", "message"],
        "properties": {
          "timestamp": {
            "bsonType": "date",
            "description": "Fecha y hora del mensaje"
          },
          "sender": {
            "bsonType": "string",
            "enum": ["player", "support"],
            "description": "Quién envió el mensaje"
          },
          "message": {
            "bsonType": "string",
            "description": "Contenido del mensaje"
          }
        }
      }
    }
  }
}
// Inserción de ejemplo
db.support_tickets.insertMany([
  {
    player_id: 501,
    issue_type: "login_problem",
    status: "open",
    messages: [
      {
        timestamp: ISODate("2025-06-15T09:00:00Z"),
        sender: "player",
        message: "No puedo ingresar con mi cuenta."
      },
      {
        timestamp: ISODate("2025-06-15T10:00:00Z"),
        sender: "support",
        message: "Estamos revisando tu caso."
      }
    ]
  },
  {
    player_id: 502,
    issue_type: "payment_issue",
    status: "closed",
    messages: [
      {
        timestamp: ISODate("2025-06-15T11:00:00Z"),
        sender: "player",
        message: "No recibí mis puntos tras la compra."
      },
      {
        timestamp: ISODate("2025-06-15T12:00:00Z"),
        sender: "support",
        message: "El pago fue acreditado correctamente."
      }
    ]
  },
  {
    player_id: 503,
    issue_type: "bug_report",
    status: "open",
    messages: [
      {
        timestamp: ISODate("2025-06-15T13:00:00Z"),
        sender: "player",
        message: "El juego se cierra solo al iniciar partida."
      },
      {
        timestamp: ISODate("2025-06-15T13:30:00Z"),
        sender: "support",
        message: "¿Puedes enviar el registro de errores?"
      }
    ]
  },
  {
    player_id: 504,
    issue_type: "account_hacked",
    status: "pending",
    messages: [
      {
        timestamp: ISODate("2025-06-15T14:00:00Z"),
        sender: "player",
        message: "Alguien cambió mi contraseña."
      },
      {
        timestamp: ISODate("2025-06-15T14:10:00Z"),
        sender: "support",
        message: "Estamos verificando la actividad de tu cuenta."
      }
    ]
  },
  {
    player_id: 505,
    issue_type: "ban_appeal",
    status: "open",
    messages: [
      {
        timestamp: ISODate("2025-06-15T15:00:00Z"),
        sender: "player",
        message: "Fui baneado injustamente."
      },
      {
        timestamp: ISODate("2025-06-15T15:20:00Z"),
        sender: "support",
        message: "Revisaremos tu caso y te informaremos."
      }
    ]
  },
  {
    player_id: 506,
    issue_type: "performance_issue",
    status: "closed",
    messages: [
      {
        timestamp: ISODate("2025-06-15T16:00:00Z"),
        sender: "player",
        message: "El juego va muy lento desde la última actualización."
      },
      {
        timestamp: ISODate("2025-06-15T16:30:00Z"),
        sender: "support",
        message: "Reinstala el juego y verifica los drivers."
      }
    ]
  },
  {
    player_id: 507,
    issue_type: "missing_rewards",
    status: "open",
    messages: [
      {
        timestamp: ISODate("2025-06-15T17:00:00Z"),
        sender: "player",
        message: "No recibí la recompensa semanal."
      },
      {
        timestamp: ISODate("2025-06-15T17:15:00Z"),
        sender: "support",
        message: "Estamos revisando tu historial de recompensas."
      }
    ]
  },
  {
    player_id: 508,
    issue_type: "report_player",
    status: "pending",
    messages: [
      {
        timestamp: ISODate("2025-06-15T18:00:00Z"),
        sender: "player",
        message: "Un jugador usó lenguaje ofensivo."
      },
      {
        timestamp: ISODate("2025-06-15T18:10:00Z"),
        sender: "support",
        message: "Gracias por tu reporte, lo investigaremos."
      }
    ]
  },
  {
    player_id: 509,
    issue_type: "connectivity_issue",
    status: "open",
    messages: [
      {
        timestamp: ISODate("2025-06-15T19:00:00Z"),
        sender: "player",
        message: "Me desconecto frecuentemente de las partidas."
      },
      {
        timestamp: ISODate("2025-06-15T19:20:00Z"),
        sender: "support",
        message: "¿Puedes probar con otra red de internet?"
      }
    ]
  },
  {
    player_id: 510,
    issue_type: "other",
    status: "closed",
    messages: [
      {
        timestamp: ISODate("2025-06-15T20:00:00Z"),
        sender: "player",
        message: "Tengo una sugerencia para el juego."
      },
      {
        timestamp: ISODate("2025-06-15T20:10:00Z"),
        sender: "support",
        message: "¡Gracias por tu sugerencia!"
      }
    ]
  }
])