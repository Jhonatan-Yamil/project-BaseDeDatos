# Arquitectura de Base de Datos Multi-Región para Proyecto Valorant

## 🗺️ Descripción General

Este sistema gestiona múltiples bases de datos PostgreSQL organizadas por regiones, permitiendo almacenar jugadores según su región (como LA o EU) y replicar los datos en una base centralizada.

```plaintext
                           +--------------------+
                           |     sqlMain        |
                           | (Puerto: 5432)     |
                           | valorant_gameplay  |
                           +--------------------+
                                  ▲
                                  │
     +----------------------------┼----------------------------+
     |                            │                            |
     ▼                            ▼                            ▼
+-------------+          +----------------+           +----------------+
| Región: LA  |          | Región: EU     |           |  (Futuras...)  |
| sqlLA       |          | sqlEU          |           | sqlAsia, etc.  |
| Puerto:5436 |          | Puerto:5437    |           +----------------+
+-------------+          +----------------+
