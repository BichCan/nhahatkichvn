import sqlite3
import json

def inspect():
    conn = sqlite3.connect('nhahatkichvn.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    db_info = {}
    for table in tables:
        cursor.execute(f"PRAGMA table_info({table})")
        columns = [row[1] for row in cursor.fetchall()]
        
        cursor.execute(f"SELECT * FROM {table} LIMIT 1")
        sample_row = cursor.fetchone()
        
        db_info[table] = {
            "columns": columns,
            "sample": sample_row
        }
        
    print(json.dumps(db_info, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    inspect()
