import random
from datetime import datetime, timedelta

NUM_MATCHES = 30000
NUM_MAPS = 11
NUM_TEAMS = 15000

def random_date(start, end):
    """Genera una fecha aleatoria entre start y end (datetime)."""
    delta = end - start
    random_days = random.randint(0, delta.days)
    return start + timedelta(days=random_days)

matches_values = []
matches_result_values = []

start_date = datetime(2023, 1, 1)
end_date = datetime(2023, 12, 31)

for match_id in range(1, NUM_MATCHES + 1):
    map_id = random.randint(1, NUM_MAPS)
    match_date = random_date(start_date, end_date).strftime('%Y-%m-%d')
    duration = random.randint(20, 140)  # duración en minutos

    matches_values.append(f"({map_id}, '{match_date}', {duration})")

    winner = random.randint(1, NUM_TEAMS)
    loser = random.randint(1, NUM_TEAMS - 1)
    if loser >= winner:
        loser += 1

    matches_result_values.append(f"({match_id}, {winner}, {loser})")

sql_matches = (
    "INSERT INTO matches (map_id, match_date, duration_minutes) VALUES\n"
    + ",\n".join(matches_values)
    + ";\n\n"
)

sql_matches_result = (
    "INSERT INTO matches_result (match_id, winning_team_id, losing_team_id) VALUES\n"
    + ",\n".join(matches_result_values)
    + ";\n"
)

with open("insert_matches.sql", "w") as f:
    f.write(sql_matches)
    f.write(sql_matches_result)

print("Archivo insert_matches.sql generado con 30,000 registros.")
