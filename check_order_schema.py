import sqlite3
import os

db_path = 'nhahatkichvn.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()

tables = ['orders', 'order_details', 'tickets', 'seats']
for table in tables:
    c.execute(f"PRAGMA table_info({table})")
    print(f"Table {table}:")
    for col in c.fetchall():
        print(f"  {col}")

conn.close()
