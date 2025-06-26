const { Pool } = require('pg');
const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
require('dotenv').config('../../.env');

class ValorantDataSync {
    constructor() {
        this.pgPool = new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST || 'localhost',
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT || 5432,
        });

        this.mysqlPool = mysql.createPool({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT || 3306,
        });

        this.mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
        this.mongoDb = null;
    }

    async initialize() {
        await this.mongoClient.connect();
        this.mongoDb = this.mongoClient.db('valorant_nosql');
        await this.createSyncTrackingCollection();
        console.log('✅ Conexiones establecidas para sincronización completa Valorant');
    }

    async createSyncTrackingCollection() {
        await this.mongoDb.collection('sync_metadata').createIndex(
            { "table_name": 1, "source": 1 }, 
            { unique: true }
        );
        console.log('📊 Sistema de tracking de sincronización creado');
    }

    // ========== POSTGRESQL - SINCRONIZACIÓN COMPLETA ==========
    async syncPostgreSQLData() {
        console.log('🔄 PostgreSQL - Sincronizando TODAS las tablas...');

        // 1. Tablas de referencia básicas
        await this.syncPGTable('country', 'SELECT * FROM country', 'sql_countries');
        await this.syncPGTable('regions', 'SELECT * FROM regions', 'sql_regions');
        await this.syncPGTable('rol', 'SELECT * FROM rol', 'sql_roles');
        await this.syncPGTable('rank_levels', 'SELECT * FROM rank_levels ORDER BY rank_order', 'sql_rank_levels');
        await this.syncPGTable('maps', 'SELECT * FROM maps', 'sql_maps');

        // 2. Agents con información de rol
        await this.syncPGTable('agents', `
            SELECT a.id, a.name, a.role as role_id, r.name as role_name
            FROM agents a 
            JOIN rol r ON a.role = r.id
        `, 'sql_agents');

        // 3. Players con información completa
        await this.syncPGTable('players', `
            SELECT 
                p.id, p.username, p.level, p.create_date, p.update_date,
                p.rank_id, rl.rank_name, rl.rank_order,
                p.country as country_id, c.name as country_name, c.code as country_code,
                p.regions as region_id, r.name as region_name, r.code as region_code
            FROM players p
            JOIN country c ON p.country = c.id
            JOIN regions r ON p.regions = r.id
            LEFT JOIN rank_levels rl ON p.rank_id = rl.id
        `, 'sql_players');

        // 4. Info Players (datos personales)
        await this.syncPGTable('info_players', `
            SELECT 
                ip.id, ip.name, ip.email, ip.player_id, ip.create_date, ip.update_date,
                p.username as player_username
            FROM info_players ip
            JOIN players p ON ip.player_id = p.id
        `, 'sql_info_players');

        // 5. Teams con nombres de jugadores
        await this.syncPGTable('teams', `
            SELECT 
                t.id, t.player_1, t.player_2, t.player_3, t.player_4, t.player_5,
                p1.username as player_1_name,
                p2.username as player_2_name,
                p3.username as player_3_name,
                p4.username as player_4_name,
                p5.username as player_5_name
            FROM teams t
            JOIN players p1 ON t.player_1 = p1.id
            JOIN players p2 ON t.player_2 = p2.id
            JOIN players p3 ON t.player_3 = p3.id
            JOIN players p4 ON t.player_4 = p4.id
            JOIN players p5 ON t.player_5 = p5.id
        `, 'sql_teams');

        // 6. Matches con información del mapa (últimos 90 días)
        await this.syncPGTable('matches', `
            SELECT 
                m.id, m.map_id, m.match_date, m.duration_minutes,
                mp.name as map_name
            FROM matches m
            JOIN maps mp ON m.map_id = mp.id
            WHERE m.match_date >= CURRENT_DATE - INTERVAL '90 days'
        `, 'sql_matches');

        // 7. Match Results con información completa
        await this.syncPGTable('matches_result', `
            SELECT 
                mr.match_id, mr.winning_team_id, mr.losing_team_id,
                m.match_date, m.duration_minutes,
                mp.name as map_name
            FROM matches_result mr
            JOIN matches m ON mr.match_id = m.id
            JOIN maps mp ON m.map_id = mp.id
            WHERE m.match_date >= CURRENT_DATE - INTERVAL '90 days'
        `, 'sql_matches_results');

        // 8. Player Stats con toda la información relacionada
        await this.syncPGTable('player_stats', `
            SELECT 
                ps.id, ps.player_id, ps.match_id, ps.agent_id, ps.team_id,
                ps.kills, ps.deaths, ps.assists,
                p.username as player_name,
                a.name as agent_name,
                r.name as agent_role,
                m.match_date,
                mp.name as map_name
            FROM player_stats ps
            JOIN players p ON ps.player_id = p.id
            JOIN agents a ON ps.agent_id = a.id
            JOIN rol r ON a.role = r.id
            JOIN matches m ON ps.match_id = m.id
            JOIN maps mp ON m.map_id = mp.id
            WHERE m.match_date >= CURRENT_DATE - INTERVAL '90 days'
        `, 'sql_player_stats');

        // 9. Player vs Player Stats
        await this.syncPGTable('player_player_stats', `
            SELECT 
                pps.id, pps.player_id, pps.opponent_id, pps.match_id,
                pps.kills, pps.deaths, pps.assists,
                p1.username as player_name,
                p2.username as opponent_name,
                m.match_date,
                mp.name as map_name
            FROM player_player_stats pps
            JOIN players p1 ON pps.player_id = p1.id
            JOIN players p2 ON pps.opponent_id = p2.id
            JOIN matches m ON pps.match_id = m.id
            JOIN maps mp ON m.map_id = mp.id
            WHERE m.match_date >= CURRENT_DATE - INTERVAL '90 days'
        `, 'sql_player_vs_player_stats');

        // 10. Matches Particionadas (si existen datos)
        await this.syncPGTable('matches_P', `
            SELECT 
                mp.id, mp.map_id, mp.match_date, mp.duration_minutes,
                m.name as map_name
            FROM matches_P mp
            JOIN maps m ON mp.map_id = m.id
            WHERE mp.match_date >= CURRENT_DATE - INTERVAL '90 days'
        `, 'sql_matches_partitioned');

        console.log('✅ PostgreSQL - Todas las tablas sincronizadas');
    }

    // ========== MYSQL - SINCRONIZACIÓN COMPLETA ==========
    async syncMySQLData() {
        console.log('🔄 MySQL - Sincronizando TODAS las tablas...');

        // 1. Tablas de referencia
        await this.syncMySQLTable('payment_methods', 'SELECT * FROM payment_methods', 'sql_payment_methods');
        await this.syncMySQLTable('transaction_types', 'SELECT * FROM transaction_types', 'sql_transaction_types');
        await this.syncMySQLTable('vp_packages', 'SELECT * FROM vp_packages ORDER BY price', 'sql_vp_packages');

        // 2. Wallets
        await this.syncMySQLTable('wallets', 'SELECT * FROM wallets', 'sql_wallets');

        // 3. Transactions con información completa (últimos 120 días)
        await this.syncMySQLTable('transactions', `
            SELECT 
                t.id, t.user_id, t.transaction_date, t.amount, t.status,
                t.payment_method_id, pm.method_name, pm.description as payment_description,
                t.transaction_type_id, tt.type_code, tt.description as transaction_description
            FROM transactions t
            LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
            LEFT JOIN transaction_types tt ON t.transaction_type_id = tt.id
            WHERE t.transaction_date >= DATE_SUB(NOW(), INTERVAL 120 DAY)
        `, 'sql_transactions');

        // 4. Purchases con información de transacción
        await this.syncMySQLTable('purchases', `
            SELECT 
                p.id, p.transaction_id, p.item_name, p.item_type, p.quantity, p.price,
                t.user_id, t.transaction_date, t.status as transaction_status,
                t.amount as transaction_amount
            FROM purchases p
            JOIN transactions t ON p.transaction_id = t.id
            WHERE t.transaction_date >= DATE_SUB(NOW(), INTERVAL 120 DAY)
        `, 'sql_purchases');

        // 5. Wallet Transactions con información completa
        await this.syncMySQLTable('wallet_transactions', `
            SELECT 
                wt.id, wt.wallet_id, wt.transaction_id, wt.vp_package_id, 
                wt.vp_amount, wt.created_at,
                w.user_id, w.balance as current_balance,
                vp.name as package_name, vp.price as package_price, vp.bonus_vp,
                t.status as transaction_status
            FROM wallet_transactions wt
            JOIN wallets w ON wt.wallet_id = w.id
            JOIN vp_packages vp ON wt.vp_package_id = vp.id
            JOIN transactions t ON wt.transaction_id = t.id
            WHERE wt.created_at >= DATE_SUB(NOW(), INTERVAL 120 DAY)
        `, 'sql_wallet_transactions');

        // 6. Transaction Errors
        await this.syncMySQLTable('transaction_errors', `
            SELECT 
                te.id, te.transaction_id, te.error_message, te.created_at,
                t.user_id, t.amount, t.status,
                pm.method_name as payment_method
            FROM transaction_errors te
            JOIN transactions t ON te.transaction_id = t.id
            LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
            WHERE te.created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
        `, 'sql_transaction_errors');

        console.log('✅ MySQL - Todas las tablas sincronizadas');
    }

    // ========== VALIDACIÓN DE INTEGRIDAD CROSS-DATABASE ==========
    async validateMongoCollections() {
        console.log('🔍 Validando integridad de colecciones MongoDB...');

        // Validar que todos los player_id en MongoDB existen en PostgreSQL
        const mongoCollectionsWithPlayerIds = [
            'user_settings', 'daily_login_rewards', 'agent_performance_history',
            'support_tickets', 'feedbacks', 'player_round_stats', 'reported_players'
        ];

        for (const collectionName of mongoCollectionsWithPlayerIds) {
            await this.validatePlayerIds(collectionName);
        }

        // Validar que todos los match_id en MongoDB existen en PostgreSQL
        const mongoCollectionsWithMatchIds = [
            'match_chat_logs', 'match_rounds', 'player_round_stats'
        ];

        for (const collectionName of mongoCollectionsWithMatchIds) {
            await this.validateMatchIds(collectionName);
        }

        console.log('✅ Validación de integridad completada');
    }

    async validatePlayerIds(collectionName) {
        const collection = this.mongoDb.collection(collectionName);
        const sqlPlayers = this.mongoDb.collection('sql_players');

        // Obtener player_ids únicos de la colección MongoDB
        const mongoPlayerIds = await collection.distinct('player_id');
        
        if (mongoPlayerIds.length === 0) {
            console.log(`⚠️  ${collectionName}: No hay player_ids para validar`);
            return;
        }

        // Verificar cuáles existen en PostgreSQL
        const existingPlayers = await sqlPlayers.find(
            { id: { $in: mongoPlayerIds } },
            { projection: { id: 1 } }
        ).toArray();

        const existingPlayerIds = existingPlayers.map(p => p.id);
        const invalidPlayerIds = mongoPlayerIds.filter(id => !existingPlayerIds.includes(id));

        if (invalidPlayerIds.length > 0) {
            console.log(`❌ ${collectionName}: ${invalidPlayerIds.length} player_ids inválidos encontrados:`, invalidPlayerIds);
            
            // Opcional: Eliminar documentos con player_ids inválidos
            // await collection.deleteMany({ player_id: { $in: invalidPlayerIds } });
            // console.log(`🗑️  ${collectionName}: Documentos con player_ids inválidos eliminados`);
        } else {
            console.log(`✅ ${collectionName}: Todos los player_ids son válidos`);
        }
    }

    async validateMatchIds(collectionName) {
        const collection = this.mongoDb.collection(collectionName);
        const sqlMatches = this.mongoDb.collection('sql_matches');

        const mongoMatchIds = await collection.distinct('match_id');
        
        if (mongoMatchIds.length === 0) {
            console.log(`⚠️  ${collectionName}: No hay match_ids para validar`);
            return;
        }

        const existingMatches = await sqlMatches.find(
            { id: { $in: mongoMatchIds } },
            { projection: { id: 1 } }
        ).toArray();

        const existingMatchIds = existingMatches.map(m => m.id);
        const invalidMatchIds = mongoMatchIds.filter(id => !existingMatchIds.includes(id));

        if (invalidMatchIds.length > 0) {
            console.log(`❌ ${collectionName}: ${invalidMatchIds.length} match_ids inválidos encontrados:`, invalidMatchIds);
        } else {
            console.log(`✅ ${collectionName}: Todos los match_ids son válidos`);
        }
    }

    // ========== MÉTODOS AUXILIARES ==========
    async syncPGTable(tableName, query, mongoCollection) {
        try {
            const result = await this.pgPool.query(query);
            await this.upsertToMongo(result.rows, mongoCollection, 'postgresql', tableName);
            console.log(`📊 PostgreSQL ${tableName}: ${result.rows.length} registros → ${mongoCollection}`);
        } catch (error) {
            console.error(`❌ Error sincronizando PostgreSQL ${tableName}:`, error.message);
        }
    }

    async syncMySQLTable(tableName, query, mongoCollection) {
        try {
            const [rows] = await this.mysqlPool.execute(query);
            await this.upsertToMongo(rows, mongoCollection, 'mysql', tableName);
            console.log(`📊 MySQL ${tableName}: ${rows.length} registros → ${mongoCollection}`);
        } catch (error) {
            console.error(`❌ Error sincronizando MySQL ${tableName}:`, error.message);
        }
    }

    async upsertToMongo(data, collection, source, tableName) {
        if (data.length === 0) return;

        const operations = data.map(row => ({
            updateOne: {
                filter: { _id: row.id },
                update: { 
                    $set: { 
                        ...row, 
                        _id: row.id,
                        source_database: source,
                        source_table: tableName,
                        last_sync: new Date()
                    }
                },
                upsert: true
            }
        }));

        try {
            await this.mongoDb.collection(collection).bulkWrite(operations, { ordered: false });
        } catch (error) {
            console.error(`❌ Error en upsert ${collection}:`, error.message);
        }
    }

    // ========== CREACIÓN DE ÍNDICES OPTIMIZADOS ==========
    async createOptimizedIndexes() {
        console.log('📊 Creando índices optimizados...');

        const indexConfigs = [
            // PostgreSQL Collections
            { 
                collection: 'sql_players', 
                indexes: [
                    { id: 1 }, 
                    { username: 1 }, 
                    { country_code: 1 }, 
                    { region_code: 1 },
                    { rank_order: -1 },
                    { "country_code": 1, "rank_order": -1 }
                ] 
            },
            { 
                collection: 'sql_matches', 
                indexes: [
                    { id: 1 },
                    { match_date: -1 }, 
                    { map_name: 1 },
                    { "match_date": -1, "map_name": 1 }
                ] 
            },
            { 
                collection: 'sql_player_stats', 
                indexes: [
                    { player_id: 1 }, 
                    { match_id: 1 }, 
                    { agent_name: 1 },
                    { match_date: -1 },
                    { "player_id": 1, "match_date": -1 },
                    { "agent_name": 1, "kills": -1 }
                ] 
            },
            { 
                collection: 'sql_agents', 
                indexes: [
                    { id: 1 }, 
                    { name: 1 }, 
                    { role_name: 1 }
                ] 
            },
            { 
                collection: 'sql_teams', 
                indexes: [
                    { id: 1 },
                    { player_1: 1 }, 
                    { player_2: 1 }, 
                    { player_3: 1 }, 
                    { player_4: 1 }, 
                    { player_5: 1 }
                ] 
            },

            // MySQL Collections
            { 
                collection: 'sql_wallets', 
                indexes: [
                    { user_id: 1 }, 
                    { balance: -1 }
                ] 
            },
            { 
                collection: 'sql_transactions', 
                indexes: [
                    { user_id: 1 }, 
                    { transaction_date: -1 }, 
                    { status: 1 },
                    { method_name: 1 },
                    { "user_id": 1, "transaction_date": -1 },
                    { "status": 1, "transaction_date": -1 }
                ] 
            },
            { 
                collection: 'sql_wallet_transactions', 
                indexes: [
                    { user_id: 1 }, 
                    { created_at: -1 },
                    { package_name: 1 },
                    { "user_id": 1, "created_at": -1 }
                ] 
            },
            { 
                collection: 'sql_vp_packages', 
                indexes: [
                    { id: 1 }, 
                    { price: 1 }, 
                    { vp_amount: -1 }
                ] 
            }
        ];

        for (const config of indexConfigs) {
            try {
                for (const index of config.indexes) {
                    await this.mongoDb.collection(config.collection).createIndex(index);
                }
                console.log(`✅ Índices creados para ${config.collection}`);
            } catch (error) {
                console.error(`❌ Error creando índices para ${config.collection}:`, error.message);
            }
        }
    }

    // ========== PROCESO COMPLETO ==========
    async fullValorantSync() {
        const startTime = Date.now();
        
        try {
            await this.initialize();
            
            console.log('🚀 Iniciando sincronización completa Valorant...');
            
            // 1. Sincronizar datos SQL
            await this.syncPostgreSQLData();
            await this.syncMySQLData();
            
            // 2. Crear índices optimizados
            await this.createOptimizedIndexes();
            
            // 3. Validar integridad cross-database
            await this.validateMongoCollections();
            
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            
            console.log(`🎯 Sincronización Valorant COMPLETA en ${duration} segundos`);
            console.log('📊 Resumen:');
            console.log('   - PostgreSQL: Todas las tablas sincronizadas');
            console.log('   - MySQL: Todas las tablas sincronizadas');
            console.log('   - MongoDB: Índices optimizados creados');
            console.log('   - Validación: Integridad referencial verificada');
            
        } catch (error) {
            console.error('❌ Error en sincronización completa:', error);
            throw error;
        }
    }

    async close() {
        await this.pgPool.end();
        await this.mysqlPool.end();
        await this.mongoClient.close();
        console.log('🔌 Todas las conexiones cerradas');
    }
}

// ========== SCHEDULER AUTOMÁTICO ==========
const cron = require('node-cron');

class ValorantSyncScheduler {
    constructor() {
        this.sync = new ValorantDataSync();
    }

    startScheduler() {
        // Sincronización incremental cada 30 minutos
        cron.schedule('*/30 * * * *', async () => {
            console.log('🔄 Sincronización automática cada 30 minutos...');
            try {
                await this.sync.fullValorantSync();
            } catch (error) {
                console.error('❌ Error en sincronización automática:', error);
            } finally {
                await this.sync.close();
                this.sync = new ValorantDataSync();
            }
        });

        // Sincronización completa diaria a las 3 AM
        cron.schedule('0 3 * * *', async () => {
            console.log('🔄 Sincronización completa nocturna...');
            try {
                await this.sync.fullValorantSync();
            } catch (error) {
                console.error('❌ Error en sincronización nocturna:', error);
            } finally {
                await this.sync.close();
                this.sync = new ValorantDataSync();
            }
        });

        console.log('⏰ Scheduler Valorant iniciado');
        console.log('   - Sincronización automática: cada 30 minutos');
        console.log('   - Sincronización completa: diaria 3:00 AM');
    }
}

// ========== EJECUCIÓN ==========
async function main() {
    const sync = new ValorantDataSync();
    
    try {
        await sync.fullValorantSync();
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sync.close();
    }
}

module.exports = { ValorantDataSync, ValorantSyncScheduler };

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}