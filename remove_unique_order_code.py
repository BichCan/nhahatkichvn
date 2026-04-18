import sqlite3, os

def migrate():
    db_path = 'nhahatkichvn.db'
    if not os.path.exists(db_path):
        print("DB not found")
        return
        
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    try:
        # 1. Ensure foreign keys are handled correctly (SQLite doesn't support ALTER TABLE DROP CONSTRAINT)
        cur.execute("PRAGMA foreign_keys=OFF")
        
        # 2. Get the current schema to verify columns (just in case)
        cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='bookings'")
        old_sql = cur.fetchone()[0]
        print(f"Old schema: {old_sql}")
        
        # 3. Create the new table without UNIQUE on order_code
        # We define the columns exactly as they are in the check_schema result but remove 'UNIQUE'
        cur.execute('''
            CREATE TABLE bookings_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                performance_id INTEGER NOT NULL,
                seat_id TEXT NOT NULL,
                seat_row TEXT NOT NULL,
                seat_number TEXT NOT NULL,
                show_date TEXT NOT NULL,
                show_time TEXT NOT NULL,
                price INTEGER NOT NULL,
                payment_method TEXT NOT NULL,
                order_code TEXT NOT NULL, -- Removed UNIQUE
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                status VARCHAR(20) DEFAULT 'holding', 
                hold_expiry_time DATETIME, 
                order_id VARCHAR(50), 
                session_id VARCHAR(255), 
                hold_start_time DATETIME, 
                converted_to_order_id VARCHAR(50), 
                cancelled_reason TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # 4. Copy data from old to new
        cur.execute('''
            INSERT INTO bookings_new (
                id, user_id, performance_id, seat_id, seat_row, seat_number, 
                show_date, show_time, price, payment_method, order_code, 
                created_at, status, hold_expiry_time, order_id, session_id, 
                hold_start_time, converted_to_order_id, cancelled_reason
            )
            SELECT 
                id, user_id, performance_id, seat_id, seat_row, seat_number, 
                show_date, show_time, price, payment_method, order_code, 
                created_at, status, hold_expiry_time, order_id, session_id, 
                hold_start_time, converted_to_order_id, cancelled_reason
            FROM bookings
        ''')
        
        # 5. Swap tables
        cur.execute("DROP TABLE bookings")
        cur.execute("ALTER TABLE bookings_new RENAME TO bookings")
        
        conn.commit()
        print("Migration successful: UNIQUE constraint removed from order_code.")
        
    except Exception as e:
        conn.rollback()
        print(f"Error during migration: {e}")
    finally:
        cur.execute("PRAGMA foreign_keys=ON")
        conn.close()

if __name__ == '__main__':
    migrate()
