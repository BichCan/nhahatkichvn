import sqlite3
import os

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nhahatkichvn.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='trigger'")
triggers = cursor.fetchall()

if not triggers:
    print("No triggers found in", db_path)

for row in triggers:
    trigger_name = row[0]
    print(f"Dropping trigger: {trigger_name} from {db_path}")
    cursor.execute(f"DROP TRIGGER IF EXISTS {trigger_name}")
    
conn.commit()
conn.close()
