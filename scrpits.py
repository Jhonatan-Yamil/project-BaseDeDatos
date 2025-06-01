import random

# Parámetros
NUM_RECORDS = 30000
PLAYER_IDS = list(range(1, 1001))      # 1000 jugadores
MATCH_IDS = list(range(4, 30004))      # matches entre 4 y 30003

# Función para generar registros válidos
def generate_player_player_stats_record():
    player_id = random.choice(PLAYER_IDS)
    opponent_id = random.choice(PLAYER_IDS)
    while opponent_id == player_id:
        opponent_id = random.choice(PLAYER_IDS)
    match_id = random.choice(MATCH_IDS)
    kills = random.randint(0, 30)
    deaths = random.randint(0, 30)
    assists = random.randint(0, 20)
    return f"({player_id}, {opponent_id}, {match_id}, {kills}, {deaths}, {assists})"

# Crear registros
records = [generate_player_player_stats_record() for _ in range(NUM_RECORDS)]

# Generar script SQL
sql_script = "INSERT INTO player_player_stats (player_id, opponent_id, match_id, kills, deaths, assists) VALUES\n"
sql_script += ",\n".join(records) + ";\n"

# Guardar archivo
output_path = "./player_player_stats.sql"
with open(output_path, "w") as file:
    file.write(sql_script)

