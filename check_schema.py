import sqlite3
import json

try:
    conn = sqlite3.connect('c:/DEAN/nhahatkichvn/nhahatkichvn.db')
    cursor = conn.cursor()
    tables = [t[0] for t in cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
    
    schema = {}
    for table in tables:
        schema[table] = cursor.execute(f"SELECT sql FROM sqlite_master WHERE name='{table}'").fetchone()[0]
        
    with open('c:/DEAN/nhahatkichvn/schema.json', 'w') as f:
        json.dump(schema, f, indent=4)
        
    print("Schema exported successfully")
except Exception as e:
    print(f"Error: {e}")
