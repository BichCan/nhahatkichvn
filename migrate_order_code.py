import os
import sqlite3


def migrate():
    # Path to the SQLite DB (relative to this script)
    db_path = os.path.join(os.path.dirname(__file__), 'nhahatkichvn.db')
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Recreate bookings table with order_code default 'PENDING'
    cur.executescript('''
        CREATE TABLE bookings_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            performance_id INTEGER,
            seat_id TEXT,
            seat_row TEXT,
            seat_number TEXT,
            show_date TEXT,
            show_time TEXT,
            price REAL,
            payment_method TEXT,
            order_code TEXT DEFAULT 'PENDING',
            status TEXT,
            hold_start_time TEXT,
            hold_expiry_time TEXT,
            session_id TEXT,
            created_at TEXT,
            updated_at TEXT
        );

        INSERT INTO bookings_new
        SELECT
            id,
            user_id,
            performance_id,
            seat_id,
            seat_row,
            seat_number,
            show_date,
            show_time,
            price,
            payment_method,
            COALESCE(NULLIF(order_code, ''), 'PENDING') AS order_code,
            status,
            hold_start_time,
            hold_expiry_time,
            session_id,
            created_at,
            updated_at
        FROM bookings;

        DROP TABLE bookings;
        ALTER TABLE bookings_new RENAME TO bookings;
    ''')
    conn.commit()
    conn.close()
    print('Migration completed – order_code now defaults to "PENDING" and existing rows updated.')


if __name__ == '__main__':
    migrate()
