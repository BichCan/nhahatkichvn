import sqlite3
import json

conn = sqlite3.connect('nhahatkichvn.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# Get the latest user_id that made an order
c.execute("SELECT user_id FROM orders ORDER BY created_at DESC LIMIT 1")
user_row = c.fetchone()
if not user_row:
    print("No orders found")
else:
    user_id = user_row['user_id']
    print(f"Testing for user_id: {user_id}")

    # Test the query
    c.execute('''
        SELECT t.id, t.order_id, o.payment_method, t.price, t.created_at,
               p.id as performance_id, p.title as performance_name, p.poster_url,
               s.seat_row, s.seat_number, s.id as seat_id,
               pl.start_time
        FROM tickets t
        JOIN orders o ON t.order_id = o.order_id
        JOIN plays pl ON t.play_id = pl.id
        JOIN performances p ON pl.performance_id = p.id
        JOIN seats s ON t.seat_id = s.id
        WHERE o.user_id = ?
        ORDER BY t.created_at DESC
    ''', (user_id,))
    rows = c.fetchall()
    print(f"Found {len(rows)} tickets using the JOIN query")
    
    # If 0, let's see which JOIN fails
    c.execute('SELECT count(*) FROM tickets t JOIN orders o ON t.order_id = o.order_id WHERE o.user_id = ?', (user_id,))
    print("Tickets JOIN Orders:", c.fetchone()[0])
    
    c.execute('SELECT count(*) FROM tickets t JOIN orders o ON t.order_id = o.order_id JOIN plays pl ON t.play_id = pl.id WHERE o.user_id = ?', (user_id,))
    print("Tickets JOIN Orders, Plays:", c.fetchone()[0])
    
    c.execute('SELECT count(*) FROM tickets t JOIN orders o ON t.order_id = o.order_id JOIN plays pl ON t.play_id = pl.id JOIN performances p ON pl.performance_id = p.id WHERE o.user_id = ?', (user_id,))
    print("Tickets JOIN Orders, Plays, Performances:", c.fetchone()[0])
    
    c.execute('SELECT count(*) FROM tickets t JOIN orders o ON t.order_id = o.order_id JOIN plays pl ON t.play_id = pl.id JOIN performances p ON pl.performance_id = p.id JOIN seats s ON t.seat_id = s.id WHERE o.user_id = ?', (user_id,))
    print("Tickets JOIN Orders, Plays, Performances, Seats:", c.fetchone()[0])
