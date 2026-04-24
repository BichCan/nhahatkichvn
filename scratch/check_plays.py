import sqlite3
import os

db_path = os.path.join('backend', 'nhahatkichvn.db')
if not os.path.exists(db_path):
    db_path = 'nhahatkichvn.db'

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
c = conn.cursor()

perf_id = 1
date = "2026-03-15"
time = "20:00"
db_start_time = f"{date} {time}:00"

print(f"Checking plays for performance_id={perf_id}, start_time={db_start_time}")
c.execute("SELECT * FROM plays WHERE performance_id = ?", (perf_id,))
all_plays = c.fetchall()
for p in all_plays:
    print(f"Play ID: {p['id']}, Start Time: {p['start_time']}")

c.execute("SELECT * FROM plays WHERE performance_id = ? AND start_time = ?", (perf_id, db_start_time))
play = c.fetchone()
if play:
    print(f"Found Play: {dict(play)}")
    play_id = play['id']
    
    print("\nChecking tickets for play_id =", play_id)
    c.execute("SELECT * FROM tickets WHERE play_id = ? LIMIT 5", (play_id,))
    tickets = c.fetchall()
    for t in tickets:
        print(dict(t))
else:
    print("Play NOT found!")

conn.close()
