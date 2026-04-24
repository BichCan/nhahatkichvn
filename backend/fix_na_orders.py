import sqlite3
import json
import sys

def fix_it():
    sys.stdout.reconfigure(encoding='utf-8')
    conn = sqlite3.connect('../nhahatkichvn.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Detached IDs from screenshot
    short_ids = ['6B3D83A2', 'B2C0E7F4', '4956B3E8', '6FF89E06', '03007107']
    
    for sid in short_ids:
        print(f"\n--- Investigating {sid} ---")
        # 1. Find full order record
        c.execute("SELECT * FROM orders WHERE order_id LIKE ?", (f"%{sid}",))
        order = c.fetchone()
        if not order:
            print(f"Order {sid} not found in orders table.")
            continue
            
        full_id = order['order_id']
        user_id = order['user_id']
        created_at = order['created_at']
        print(f"Full ID: {full_id}, User: {user_id}, Created: {created_at}")
        
        # 2. Check all tables for this full_id
        c.execute("SELECT count(*) as cnt FROM tickets WHERE order_id = ?", (full_id,))
        print(f"Tickets: {c.fetchone()['cnt']}")
        
        c.execute("SELECT count(*) as cnt FROM bookings WHERE order_id = ? OR converted_to_order_id = ?", (full_id, full_id))
        print(f"Bookings: {c.fetchone()['cnt']}")
        
        c.execute("SELECT count(*) as cnt FROM order_details WHERE order_id = ?", (full_id,))
        print(f"Order Details: {c.fetchone()['cnt']}")
        
        # 3. Try to find orphaned records for this user around this time
        # Look for bookings for this user created within 5 minutes of the order
        c.execute("""
            SELECT b.*, p.title 
            FROM bookings b 
            JOIN performances p ON b.performance_id = p.id
            WHERE b.user_id = ? 
            AND abs(strftime('%s', b.created_at) - strftime('%s', ?)) < 300
        """, (user_id, created_at))
        orphans = c.fetchall()
        if orphans:
            print(f"Found {len(orphans)} orphaned bookings that might belong to this order!")
            for b in orphans:
                print(f"  - Performance: {b['title']}, Date: {b['show_date']}, Time: {b['show_time']}")
                # FIX: Link them!
                c.execute("UPDATE bookings SET order_id = ? WHERE id = ?", (full_id, b['id']))
                print(f"  - FIXED: Linked booking {b['id']} to order {full_id}")
        else:
            print("No matching orphaned records found.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_it()
