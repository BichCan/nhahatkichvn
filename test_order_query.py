import sqlite3
import os

DB_PATH = 'nhahatkichvn.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def test_query(order_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT 
            s.seat_row, 
            s.seat_number, 
            p.title as performance_title,
            pl.start_time as showtime,
            od.price
        FROM order_details od
        JOIN tickets t ON od.ticket_id = t.id
        JOIN seats s ON t.seat_id = s.id
        JOIN plays pl ON t.play_id = pl.id
        JOIN performances p ON pl.performance_id = p.id
        WHERE od.order_id = ?
    ''', (order_id,))
    rows = c.fetchall()
    print(f"Results for {order_id}: {len(rows)} rows found.")
    for row in rows:
        print(dict(row))
    conn.close()

# Test with one of the sample IDs
test_query('ORD-20260110-001')
