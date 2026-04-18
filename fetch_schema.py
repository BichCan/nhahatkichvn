import sqlite3
import os

def get_schema():
    db_path = 'd:/DEAN/nhahatkichvn/nhahatkichvn.db'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    tables = ['tickets', 'orders', 'bookings', 'performances', 'plays']
    for table in tables:
        print(f"\n--- Table: {table} ---")
        cursor.execute(f"PRAGMA table_info({table})")
        columns = cursor.fetchall()
        for col in columns:
            print(col)
            
        cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table}'")
        row = cursor.fetchone()
        if row:
            print("\nCreate SQL:")
            print(row[0])
            
    conn.close()

if __name__ == "__main__":
    get_schema()
