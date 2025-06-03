import random
from datetime import datetime, timedelta

NUM_WALLET_TRANSACTIONS = 1000
MAX_WALLET_ID = 1000
MAX_TRANSACTION_ID = 30000
MAX_VP_PACKAGE_ID = 5

def random_date(start, end):
    """Genera una fecha aleatoria entre start y end (datetime)."""
    delta = end - start
    random_seconds = random.randint(0, int(delta.total_seconds()))
    return start + timedelta(seconds=random_seconds)

wallet_transactions_values = []
start_date = datetime(2023, 1, 1)
end_date = datetime(2025, 6, 1)

for _ in range(NUM_WALLET_TRANSACTIONS):
    wallet_id = random.randint(1, MAX_WALLET_ID)
    transaction_id = random.randint(1, MAX_TRANSACTION_ID)+1
    vp_package_id = random.randint(1, MAX_VP_PACKAGE_ID)
    vp_amount = random.randint(1, 1000)
    created_at = random_date(start_date, end_date).strftime('%Y-%m-%d %H:%M:%S')
    
    wallet_transactions_values.append(
        f"({wallet_id}, {transaction_id}, {vp_package_id}, {vp_amount}, '{created_at}')"
    )

sql_wallet_transactions = (
    "INSERT INTO wallet_transactions (wallet_id, transaction_id, vp_package_id, vp_amount, created_at) VALUES\n"
)
sql_wallet_transactions += ",\n".join(wallet_transactions_values) + ";\n"

with open("insert_wallet_transactions.sql", "w") as f:
    f.write(sql_wallet_transactions)

print("Archivo insert_wallet_transactions.sql generado con 1000 registros.")
