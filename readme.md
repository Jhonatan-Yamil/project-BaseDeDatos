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

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <https://github.com/Jhonatan-Yamil/project-BaseDeDatos.git>
   cd project-BaseDeDatos
   ```

2. **Configurar variables de entorno**
   ```bash
   # El archivo .env ya está configurado con valores por defecto
   # Modificar si es necesario
   ```

3. **Instalar dependencias Node.js**
   ```bash
   npm install
   ```

4. **Levantar los contenedores**
   ```bash
   docker-compose up -d
   ```

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

### Conexiones a Bases de Datos

#### PostgreSQL
```bash
# Via Docker
docker exec -it proyecto-valorant-postgres psql -U jhonny -d valorant_gameplay_db

# Via cliente externo
Host: localhost
Port: 5432
Database: valorant_gameplay_db
Username: jhonny
Password: 123
```

#### MySQL
```bash
# Via Docker
docker exec -it mysql mysql -u jhonny -p valorant_transactions_db

# Via cliente externo
Host: localhost
Port: 3306
Database: valorant_transactions_db
Username: jhonny
Password: 123
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

### 4. Sistema de Caché (Redis)

#### Tipos de Caché:
- **Estadísticas de jugadores** (TTL: 5 min)
- **Rankings globales** (TTL: 30 min)
- **Datos de sesión** (TTL: 1 hora)

## 📊 Características Avanzadas

### Replicación Master-Slave
```bash
cd masterSlaves/
docker-compose up -d
```

### Sharding y Particionado
```bash
cd sharding/
docker-compose up -d
```

### Sincronización de Datos
Scripts automáticos para sincronizar datos entre motores:
```bash
node init/sync/syncData.js
```

## 🔒 Seguridad y Roles

### Roles PostgreSQL
- `gameplay_admin`: Administrador del sistema de juego
- `stats_analyst`: Analista de estadísticas
- `player_basic`: Usuario básico

### Roles MySQL
- `transaction_admin`: Administrador de transacciones
- `financial_analyst`: Analista financiero
- `wallet_user`: Usuario de billeteras

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

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**
   ```bash
   # Verificar que los contenedores estén corriendo
   docker-compose ps
   
   # Reiniciar servicios
   docker-compose restart postgres mysql
   ```

2. **MongoDB sin autenticación**
   ```bash
   # Para desarrollo, usar sin autenticación
   docker exec -it mongo-valorant mongosh --eval "db.runCommand({listCollections: 1})"
   ```

3. **Redis connection refused**
   ```bash
   # Verificar configuración de Redis
   docker-compose logs redis-cache
   ```

4. **Permisos de archivos de backup**
   ```bash
   # En Windows PowerShell
   mkdir -p backups/mysql
   mkdir -p backups/postgres
   ```

## 📚 Documentación Adicional

- [Diagrama de Arquitectura](./masterSlaves/diagrama.md)
- [Configuración de Caché](./cache/cache-design.md)
- [Estrategia de Sharding](./sharding/sharding.md)
- [Scripts de MongoDB](./mongo-valorant/scripts/)

## 🧪 Pruebas y Ejemplos

### Probar Stored Procedures
```sql
-- PostgreSQL: Registrar una partida
CALL registrar_partida(1, 1, 2, '2024-01-15', 13, 11, 'Ascent');

-- MySQL: Realizar una compra
CALL realizar_compra_vp(1, 1000, 'Compra de VP para batalla');
```

### Consultas MongoDB
```javascript
// Buscar reportes por jugador
db.reports.find({reported_player_id: 12345});

// Estadísticas de reportes
db.reports.aggregate([
  {$group: {_id: "$report_type", count: {$sum: 1}}}
]);
```

### Uso de Caché Redis
```javascript
// Obtener estadísticas de jugador desde caché
const playerStats = await redis.get('player:stats:12345');
```

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
- **Sincronización**: Scripts automáticos para mantener consistencia entre motores
- **Escalabilidad**: Arquitectura preparada para crecimiento horizontal
- **Monitoreo**: Índices y análisis de rendimiento implementados
- **Backup**: Estrategia completa de respaldo y recuperación

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2024  
**Autor**: Jhonatan - Bases de Datos Avanzadas
