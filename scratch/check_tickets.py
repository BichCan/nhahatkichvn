import sqlite3
import os

db_path = os.path.join('backend', 'nhahatkichvn.db')
if not os.path.exists(db_path):
    db_path = 'nhahatkichvn.db'

conn = sqlite3.connect(db_path)
c = conn.cursor()

print("Counting tickets per play:")
c.execute("SELECT play_id, COUNT(*) FROM tickets GROUP BY play_id LIMIT 10")
for row in c.fetchall():
    print(row)

conn.close()
