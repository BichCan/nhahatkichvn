import sqlite3

def list_triggers():
    conn = sqlite3.connect('nhahatkichvn.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='trigger'")
    for row in cursor.fetchall():
        print(f"Trigger {row[0]}:\n{row[1]}\n")

if __name__ == '__main__':
    list_triggers()
