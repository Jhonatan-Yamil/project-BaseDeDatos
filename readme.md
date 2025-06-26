# 🎮 Sistema de Base de Datos Híbrido - Valorant Game Management

## 📋 Descripción del Proyecto

Sistema de base de datos avanzado e híbrido diseñado para gestionar un juego tipo Valorant, integrando múltiples motores de bases de datos relacionales (PostgreSQL, MySQL) y NoSQL (MongoDB, Redis) para optimizar diferentes aspectos del sistema:

- **PostgreSQL**: Gestión de jugadores, estadísticas competitivas y análisis de rendimiento
- **MySQL**: Sistema de transacciones financieras, billeteras y compras
- **MongoDB**: Reportes de comunidad, denuncias y contenido flexible
- **Redis**: Sistema de caché para optimización de rendimiento

## 📁 Estructura del Proyecto

```
project-BaseDeDatos/
├── 📂 backup/                    # Scripts de respaldo y restauración
├── 📂 backups/                   # Archivos de respaldo generados
├── 📂 cache/                     # Configuración y scripts de Redis
├── 📂 data_Insert/               # Scripts de inserción de datos
├── 📂 init/                      # Scripts de inicialización de BD
├── 📂 masterSlaves/              # Configuración Master-Slave
├── 📂 mongo-valorant/            # Colecciones y scripts MongoDB
├── 📂 mysql-valorant/            # SPs, funciones, triggers MySQL
├── 📂 postgres-valorant/         # SPs, funciones, triggers PostgreSQL
├── 📂 sharding/                  # Configuración de particionado
├── 📂 snowFlake/                 # Configuración del ETL y snowFlake
├── 🐳 docker-compose.yml         # Configuración principal Docker
├── 📦 package.json               # Dependencias Node.js
├── 🔧 .env                       # Variables de entorno
└── 📖 README.md                  # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (para scripts de backup y utilidades)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Jhonatan-Yamil/project-BaseDeDatos.git
   cd project-BaseDeDatos
   code . 
   ```

2. **Configurar variables de entorno**
   ```bash
   ### Environment Setup
    POSTGRES_USER=user
    POSTGRES_PASSWORD=user123
    POSTGRES_DB=valorant_gameplay_db

    MYSQL_ROOT_PASSWORD=user123
    MYSQL_DATABASE=valorant_transactions_db
    MYSQL_USER=user
    MYSQL_PASSWORD=123
    MYSQL_HOST=localhost
    MYSQL_PORT=3306

    REDIS_URL=redis://default:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379
   ```

3. **Instalar dependencias Node.js**
   ```bash
   npm install
   ```

   **Contenedor Principal (Base del Sistema):**
   ```bash
   # Desde la raíz del proyecto
   docker-compose up -d
   ```
   
   **Contenedores Específicos por Funcionalidad:**
   
   **Master-Slave (Replicación):**
   ```bash
   cd masterSlaves/
   docker-compose up -d
   cd ..
   ```
   
   **MongoDB (Sistema de Reportes):**
   ```bash
   cd mongo-valorant/
   docker-compose up -d
   cd ..
   ```
   
   **Sharding (Particionado):**
   ```bash
   cd sharding/
   docker compose --env-file ../.env up -d
   cd ..
   ```
   
   **Cache Redis:**
   ```bash
   cd cache/
   docker-compose up -d
   cd ..
   ```
Tomar en cuenta que se debe probar modulo por modulo, ya que cada uno tiene su propia configuración y puede existir algun choque de puertos.

5. **Verificar que todos los servicios estén corriendo**
   ```bash
   docker-compose ps
   ```

## 🎯 Comandos Principales

### Gestión de Contenedores
```bash
# Parar todos los servicios
docker-compose down

# Ver logs de un servicio específico
docker-compose logs postgres
docker-compose logs mysql
etc.
```

### Backups y Restauración
```bash
# Backup PostgreSQL
npm run backup:postgres

# Backup MySQL
npm run backup:mysql

# Restaurar PostgreSQL
npm run restore:pg

# Restaurar MySQL
npm run restore:mysql
```

#### ⚡ Sistema de Caché (Redis)
```bash
# Contenedores requeridos: cache/redis, postgres, mysql
cd cache/
docker-compose up -d
cd ..
docker-compose up -d postgres mysql

# Ejecutar pruebas de caché
cd cache/
node index.js
cd ..
```

#### 🧩 Pruebas de Sharding
```bash
# Contenedores requeridos: sharding específicos
cd sharding/
docker compose --env-file ../.env up -d

# Ejecutar script de prueba de sharding
node index.js

```

#### MySQL
```bash
# Via Docker
docker exec -it mysql-valorant mysql -u user -p valorant_transactions_db
```

#### MongoDB
```bash
# Via Docker
docker exec -it mongo-valorant mongosh valorant_reports

# Via cliente externo
mongodb://localhost:27017/valorant_reports
```

#### Redis
```bash
# Via Docker
docker exec -it redis-cache redis-cli

# URL de conexión
redis://default:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379
```
### 📦 Nombres de Contenedores por Defecto

| Servicio | Nombre del Contenedor | Puerto Host | Puerto Interno |
|----------|---------------------|-------------|----------------|
| **Contenedores Principales** |
| PostgreSQL Principal | `proyecto-valorant-postgres` | 5432 | 5432 |
| MySQL Principal | `mysql` | 3306 | 3306 |
| **Contenedores de Cache** |
| Redis Cache | `cache` | 6379 | 6379 |
| **Contenedores Master-Slave** |
| MySQL Master | `mysql_master` | 3306 | 3306 |
| MySQL Slave 1 | `mysql_slave1` | 3307 | 3306 |
| MySQL Slave 2 | `mysql_slave2` | 3308 | 3306 |
| **Contenedores de Sharding** |
| PostgreSQL Shard LA | `proyecto-valorant-postgres-LA` | 5436 | 5432 |
| PostgreSQL Shard EU | `proyecto-valorant-postgres-EU` | 5437 | 5432 |
| **Contenedores MongoDB** |
| MongoDB | `mongo` | 27017 | 27017 |

## 🔧 Funcionalidades Principales

### 1. Sistema de Jugadores y Estadísticas (PostgreSQL)

#### Stored Procedures Clave:
- `registrar_partida()`: Registra partidas y actualiza estadísticas
- `sp_assign_players_to_team()`: Asigna jugadores a equipos
- `sp_insert_player()`: Registra nuevos jugadores
- `sp_delete_player()`: Elimina jugadores del sistema

#### Funciones Principales:
- `get_player_win_rate()`: Calcula ratio de victorias
- `get_player_performance_metrics()`: Métricas de rendimiento
- `average_kills_by_rank_and_region()`: Estadísticas por rango y región

#### Triggers:
- `actualizar_rangos_al_registrar_match`: Actualiza rangos después de partidas
- `bajar_rango`: Gestiona degradación de rangos

### 2. Sistema Financiero (MySQL)

#### Stored Procedures Clave:
- `realizar_compra_vp()`: Procesa compras de Valorant Points
- `sp_refund_transaction()`: Gestiona reembolsos

#### Funciones:
- `tiene_saldo_suficiente()`: Verifica saldo disponible
- `total_gastado_por_usuario()`: Calcula gasto total por usuario

#### Triggers:
- `update_wallet_balance`: Actualiza saldo de billeteras
- `trg_complete_transaction_on_wallet_transaction`: Completa transacciones

### 3. Sistema de Reportes (MongoDB)

#### Colecciones Principales:
- `reports`: Reportes de jugadores
- `community_feedback`: Retroalimentación de la comunidad
- `match_reports`: Reportes de partidas

## 📈 Monitoreo y Rendimiento

### Índices Principales
- PostgreSQL: Índices en `players`, `matches`, `player_stats`
- MySQL: Índices en `transactions`, `wallets`, `purchases`

### Análisis de Rendimiento
```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM players WHERE rank_id = 1;

-- MySQL
EXPLAIN SELECT * FROM transactions WHERE user_id = 123;
```


## 📚 Documentación Adicional

- [Diagrama de Arquitectura](./masterSlaves/diagrama.md)
- [Configuración de Caché](./cache/cache-disign.md)
- [Estrategia de Sharding](./sharding/sharding.md)
- [Scripts de MongoDB](./mongo-valorant/scripts/)


## 👥 Contribuciones

Este proyecto fue desarrollado como parte del curso de Bases de Datos Avanzadas, integrando:

- ✅ Motores relacionales y NoSQL
- ✅ Stored procedures y funciones avanzadas
- ✅ Triggers y automatización
- ✅ Sistema de caché distribuido
- ✅ Replicación y alta disponibilidad
- ✅ Particionado y escalabilidad
- ✅ Backups automáticos
- ✅ Seguridad y roles de usuario
- ✅ Monitoreo de rendimiento

## 📝 Notas Técnicas

- **Ofuscamiento de datos**: Implementado en DBeaver para protección de información sensible
- **Escalabilidad**: Arquitectura preparada para crecimiento horizontal
- **Monitoreo**: Índices y análisis de rendimiento implementados
- **Backup**: Estrategia completa de respaldo y recuperación
