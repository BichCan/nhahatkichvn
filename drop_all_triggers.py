import sqlite3

def drop_all_triggers():
    conn = sqlite3.connect('nhahatkichvn.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='trigger'")
    triggers = cursor.fetchall()
    
    for row in triggers:
        trigger_name = row[0]
        print(f"Dropping trigger: {trigger_name}")
        cursor.execute(f"DROP TRIGGER IF EXISTS {trigger_name}")
        
    conn.commit()
    conn.close()
    print("All triggers dropped successfully.")

if __name__ == '__main__':
    drop_all_triggers()
