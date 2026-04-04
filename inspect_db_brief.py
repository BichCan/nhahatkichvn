import sqlite3
import os

DB_PATH = 'nhahatkichvn.db'
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = c.fetchall()
print("Tables:", tables)

for (table_name,) in tables:
    print(f"\nSchema for {table_name}:")
    c.execute(f"PRAGMA table_info({table_name});")
    print(c.fetchall())
conn.close()
