import psycopg2
import pymysql
from pymongo import MongoClient
import pandas as pd
import logging
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='../.env')

# Configuración de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Directorio de salida
output_dir = "etl_output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Conexiones a bases de datos
try:
    pg_conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host="localhost",
        port="5432"
    )
    pg_cursor = pg_conn.cursor()
    logger.info("Conexión a PostgreSQL establecida")

    mysql_conn = pymysql.connect(
        db=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        host="localhost",
        port=3306
    )
    mysql_cursor = mysql_conn.cursor()
    logger.info("Conexión a MySQL establecida")

    mongo_client = MongoClient("mongodb://mongo:mongo123@localhost:27017/")
    mongo_db = mongo_client["admin"]
    logger.info("Conexión a MongoDB establecida")

except Exception as e:
    logger.error(f"Error en las conexiones: {e}")
    raise

# Extracción
try:
    pg_cursor.execute("""
        SELECT ps.id, ps.player_id, ps.match_id, ps.agent_id, ps.team_id, ps.kills, ps.deaths, ps.assists
        FROM player_stats ps
        JOIN matches m ON ps.match_id = m.id
        WHERE m.match_date >= '2023-06-01'
    """)
    pg_data = pg_cursor.fetchall()
    logger.info(f"Extracción de {len(pg_data)} registros de PostgreSQL")

    mysql_cursor.execute("""
        SELECT id, user_id, transaction_date, amount, payment_method_id, transaction_type_id, status
        FROM transactions
    """)
    mysql_data = mysql_cursor.fetchall()
    logger.info(f"Extracción de {len(mysql_data)} registros de MySQL")
    if mysql_data:
        logger.info("Primeros 3 registros de MySQL (transactions):")
        for record in mysql_data[:3]:
            logger.info(record)
    else:
        logger.warning("No se encontraron registros en transactions")

    mongo_data = mongo_db.player_performance.find({
        "performance.match_id": {"$gte": 0}
    })
    mongo_list = list(mongo_data)

except Exception as e:
    logger.error(f"Error en la extracción: {e}")
    raise

# Transformación
try:
    pg_df = pd.DataFrame(pg_data, columns=["id", "player_id", "match_id", "agent_id", "team_id", "kills", "deaths", "assists"])
    mysql_df = pd.DataFrame(mysql_data, columns=["transaction_id", "user_id", "transaction_date", "amount", "payment_method_id", "transaction_type_id", "status"])
    
    if mongo_list:
        mongo_df = pd.json_normalize(mongo_list, record_path='performance', meta=['player_id', 'agent'])
    else:
        mongo_df = pd.DataFrame(columns=['match_id', 'kills', 'deaths', 'assists', 'player_id', 'agent'])
        logger.warning("Created empty mongo_df due to no data in player_performance")

    pg_df = pg_df.fillna(0)
    mysql_df = mysql_df[mysql_df['status'] == 'success']

    merged_stats = pg_df.merge(mongo_df[['match_id', 'kills', 'deaths', 'assists']], on='match_id', how='left', suffixes=('_pg', '_mongo'))
    merged_stats['total_kills'] = merged_stats['kills_pg'].fillna(0) + merged_stats['kills_mongo'].fillna(0)

    pg_df['match_id'] = pg_df['match_id'].astype(int)
    mysql_df['transaction_date'] = pd.to_datetime(mysql_df['transaction_date'])

    pg_df['kda'] = (pg_df['kills'] + pg_df['assists']) / pg_df['deaths'].replace(0, 1)

    fact_player_stats = pg_df[['id', 'player_id', 'match_id', 'agent_id', 'team_id', 'kills', 'deaths', 'assists', 'kda']]
    fact_transactions = mysql_df

    logger.info("Transformación completada")

except Exception as e:
    logger.error(f"Error en la transformación: {e}")
    raise

# Generación de archivos CSV
try:
    fact_player_stats.to_csv(os.path.join(output_dir, "fact_player_stats.csv"), index=False)
    logger.info("Archivo fact_player_stats.csv generado")

    fact_transactions.to_csv(os.path.join(output_dir, "fact_transactions.csv"), index=False)
    logger.info("Archivo fact_transactions.csv generado")

except Exception as e:
    logger.error(f"Error al generar archivos CSV: {e}")
    raise

finally:
    pg_cursor.close()
    pg_conn.close()
    mysql_cursor.close()
    mysql_conn.close()
    mongo_client.close()
    logger.info("Todas las conexiones cerradas")
