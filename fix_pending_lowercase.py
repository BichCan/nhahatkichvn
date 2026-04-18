import sqlite3, os

def fix_pending_lowercase():
    db_path = os.path.join(os.path.dirname(__file__), 'nhahatkichvn.db')
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
        
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    try:
        # Update order_id
        cur.execute("UPDATE bookings SET order_id = 'pending' WHERE order_id IS NULL OR order_id = '' OR order_id = 'PENDING'")
        # Update order_code
        cur.execute("UPDATE bookings SET order_code = 'pending' WHERE order_code IS NULL OR order_code = '' OR order_code = 'PENDING'")
        
        conn.commit()
        print(f"Successfully updated records to lowercase 'pending'. Rows affected: {cur.rowcount}")
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    fix_pending_lowercase()
