import sqlite3
import os

db_path = os.path.join('backend', 'nhahatkichvn.db')
if not os.path.exists(db_path):
    db_path = 'nhahatkichvn.db'

conn = sqlite3.connect(db_path)
c = conn.cursor()
print("--- tickets ---")
c.execute("PRAGMA table_info(tickets)")
for row in c.fetchall():
    print(row)

print("\n--- seats ---")
c.execute("PRAGMA table_info(seats)")
for row in c.fetchall():
    print(row)
conn.close()
