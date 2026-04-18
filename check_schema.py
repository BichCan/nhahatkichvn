import sqlite3, os

def check_schema():
    db_path = 'nhahatkichvn.db'
    if not os.path.exists(db_path):
        print("DB not found")
        return
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='bookings'")
    print(cur.fetchone()[0])
    conn.close()

if __name__ == '__main__':
    check_schema()
