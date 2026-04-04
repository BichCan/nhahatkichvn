import sqlite3

conn = sqlite3.connect('nhahatkichvn.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

print("=== PLAYS TABLE ===")
c.execute('SELECT id, performance_id, start_time, end_time, status FROM plays ORDER BY start_time')
rows = c.fetchall()
for r in rows:
    print(f"  id={r['id']} perf_id={r['performance_id']} start={r['start_time']} status={r['status']}")

print("\n=== PERFORMANCES TABLE ===")
c.execute('SELECT id, title, status FROM performances')
rows = c.fetchall()
for r in rows:
    print(f"  id={r['id']} title={r['title']} status={r['status']}")

print("\n=== RATINGS TABLE ===")
c.execute('SELECT id, performance_id, rating, review FROM ratings')
rows = c.fetchall()
for r in rows:
    print(f"  id={r['id']} perf_id={r['performance_id']} rating={r['rating']} review={r['review'][:50] if r['review'] else ''}")

conn.close()
