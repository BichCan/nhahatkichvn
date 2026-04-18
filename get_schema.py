import sqlite3
import os

db_path = 'nhahatkichvn.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    tables = ['tickets', 'orders', 'bookings']
    for table in tables:
        print(f"--- Table: {table} ---")
        cursor.execute(f"PRAGMA table_info({table})")
        columns = cursor.fetchall()
        for col in columns:
            print(col)
        print("\n")
    conn.close()
else:
    print("Database not found")
