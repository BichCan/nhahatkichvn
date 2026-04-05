from flask import Flask, jsonify, request, session
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'nhahatkichvn_secret_key' # Replace with a more secure key in production
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Session configuration for local development
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=1800 # 30 minutes
)

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'nhahatkichvn.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    # Ensure users table exists
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL
        )
    ''')
    # Create bookings table
    c.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
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
            order_code TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()



@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"success": False, "message": "Email và mật khẩu không được để trống"}), 400
        
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    user = c.fetchone()
    conn.close()
    
    if user:
        session.permanent = True
        session['user_id'] = user['id']
        session['user_name'] = user['full_name']
        return jsonify({
            "success": True, 
            "message": "Đăng nhập thành công",
            "user": {
                "id": user['id'],
                "full_name": user['full_name'],
                "email": user['email']
            }
        })
    else:
        return jsonify({"success": False, "message": "Email hoặc mật khẩu không chính xác"}), 401

@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({
            "logged_in": True,
            "user": {
                "id": session['user_id'],
                "full_name": session['user_name']
            }
        })
    return jsonify({"logged_in": False})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Đã đăng xuất"})

@app.route('/api/bookings', methods=['GET', 'POST'])
def handle_bookings():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Vui lòng đăng nhập"}), 401
    
    user_id = session['user_id']
    conn = get_db_connection()
    c = conn.cursor()
    
    if request.method == 'POST':
        data = request.json
        # Handle list of bookings (each seat is a booking)
        bookings = data.get('bookings', [])
        if not bookings:
             return jsonify({"success": False, "message": "Không có thông tin đặt vé"}), 400
        
        try:
            for b in bookings:
                c.execute('''
                    INSERT INTO bookings (
                        user_id, performance_id, seat_id, seat_row, seat_number, 
                        show_date, show_time, price, payment_method, order_code
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_id, b['performance_id'], b['seat_id'], b['seat_row'], b['seat_number'],
                    b['show_date'], b['show_time'], b['price'], b['payment_method'], b['order_code']
                ))
                
            # If payment is cash, we create an order and corresponding tickets
            if bookings and bookings[0].get('payment_method') in ['cash', 'Tiền mặt']:
                import uuid
                from datetime import datetime
                
                now = datetime.now()
                order_id = f"ORD-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
                total_amount = sum(b['price'] for b in bookings)
                
                c.execute('''
                    INSERT INTO orders (
                        order_id, user_id, total_amount, payment_status, payment_method,
                        payment_date, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    order_id, user_id, total_amount, 'pending', 'cash',
                    now.strftime('%Y-%m-%d %H:%M:%S'), now.strftime('%Y-%m-%d %H:%M:%S'), now.strftime('%Y-%m-%d %H:%M:%S')
                ))
                
                for b in bookings:
                    # Convert 'DD/MM/YYYY' to 'YYYY-MM-DD'
                    date_parts = str(b['show_date']).split('/')
                    if len(date_parts) == 3:
                        db_date = f"{date_parts[2]}-{date_parts[1]}-{date_parts[0]}"
                    else:
                        db_date = b['show_date']
                    db_start_time = f"{db_date} {b['show_time']}:00"
                    
                    # Find play_id
                    c.execute("SELECT id FROM plays WHERE performance_id = ? AND start_time = ?", (b['performance_id'], db_start_time))
                    play_row = c.fetchone()
                    
                    if play_row:
                        play_id = play_row['id']
                    else:
                        # Auto-create the play if it doesn't exist
                        c.execute('''
                            INSERT INTO plays (performance_id, start_time, end_time, status, created_at, updated_at)
                            VALUES (?, ?, ?, ?, ?, ?)
                        ''', (
                            b['performance_id'], db_start_time, db_start_time, 'active',
                            now.strftime('%Y-%m-%d %H:%M:%S'), now.strftime('%Y-%m-%d %H:%M:%S')
                        ))
                        play_id = c.lastrowid
                        
                    # Find or Create seat_id properly
                    s_row = b.get('seat_row')
                    s_num = b.get('seat_number')
                    c.execute("SELECT id FROM seats WHERE seat_row = ? AND seat_number = ?", (s_row, s_num))
                    seat_db_row = c.fetchone()
                    
                    if seat_db_row:
                        real_seat_id = seat_db_row['id']
                    else:
                        try:
                            # If for some reason seat_id is just an int string like '15'
                            real_seat_id = int(b.get('seat_id'))
                        except (ValueError, TypeError):
                            # Auto-create the seat to maintain foreign key integrity
                            c.execute('''
                                INSERT INTO seats (seat_row, seat_number, seat_type_id, is_active, created_at)
                                VALUES (?, ?, ?, ?, ?)
                            ''', (s_row, s_num, 1, 1, now.strftime('%Y-%m-%d %H:%M:%S')))
                            real_seat_id = c.lastrowid
                            
                    c.execute('''
                        INSERT INTO tickets (
                            play_id, seat_id, price, status, held_by_user_id, order_id, created_at, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        play_id, real_seat_id, int(b['price']), 'paid', user_id, order_id, 
                        now.strftime('%Y-%m-%d %H:%M:%S'), now.strftime('%Y-%m-%d %H:%M:%S')
                    ))
                    ticket_id = c.lastrowid
                    c.execute('''
                        INSERT INTO order_details (order_id, ticket_id, price)
                        VALUES (?, ?, ?)
                    ''', (order_id, ticket_id, int(b['price'])))
            
            conn.commit()
            return jsonify({"success": True, "message": "Đặt vé thành công"})
        except Exception as e:
            conn.rollback()
            return jsonify({"success": False, "message": str(e)}), 500
        finally:
            conn.close()
            
    else: # GET
        c.execute('''
            SELECT b.*, p.title as performance_name, p.poster_url 
            FROM bookings b
            JOIN performances p ON b.performance_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        ''', (user_id,))
        rows = c.fetchall()
        
        bookings = []
        for r in rows:
            bookings.append({
                "id": r["id"],
                "orderCode": r["order_code"],
                "performance": {
                    "id": r["performance_id"],
                    "name": r["performance_name"],
                    "poster_url": r["poster_url"]
                },
                "seat": {
                    "id": r["seat_id"],
                    "row": r["seat_row"],
                    "number": r["seat_number"]
                },
                "selectedDate": r["show_date"],
                "selectedTime": r["show_time"],
                "price": r["price"],
                "paymentMethod": r["payment_method"],
                "createdAt": r["created_at"]
            })
        conn.close()
        return jsonify(bookings)

@app.route('/api/tickets', methods=['GET', 'DELETE'])
def get_tickets():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Vui lòng đăng nhập"}), 401
    
    user_id = session['user_id']
    conn = get_db_connection()
    c = conn.cursor()
    
    if request.method == 'DELETE':
        try:
            c.execute('''
                DELETE FROM order_details
                WHERE ticket_id IN (
                    SELECT t.id FROM tickets t
                    JOIN orders o ON t.order_id = o.order_id
                    WHERE o.user_id = ?
                )
            ''', (user_id,))
            c.execute('''
                DELETE FROM tickets
                WHERE order_id IN (
                    SELECT order_id FROM orders WHERE user_id = ?
                )
            ''', (user_id,))
            conn.commit()
            return jsonify({"success": True, "message": "Đã xóa tất cả vé"})
        except Exception as e:
            conn.rollback()
            return jsonify({"success": False, "message": str(e)}), 500
        finally:
            conn.close()
            
    c.execute('''
        SELECT t.id, t.order_id, o.payment_method, t.price, t.created_at,
               p.id as performance_id, p.title as performance_name, p.poster_url,
               s.seat_row, s.seat_number, s.id as seat_id,
               pl.start_time
        FROM tickets t
        JOIN orders o ON t.order_id = o.order_id
        JOIN plays pl ON t.play_id = pl.id
        JOIN performances p ON pl.performance_id = p.id
        JOIN seats s ON Cast(t.seat_id as integer) = s.id
        WHERE o.user_id = ?
        ORDER BY t.created_at DESC
    ''', (user_id,))
    rows = c.fetchall()
    
    tickets = []
    for r in rows:
        dt_parts = str(r["start_time"]).split(" ")
        date_part = dt_parts[0] if len(dt_parts) > 0 else ""
        time_part = dt_parts[1][:5] if len(dt_parts) > 1 else ""
        
        # Convert YYYY-MM-DD back to DD/MM/YYYY
        if date_part:
            d_parts = date_part.split("-")
            if len(d_parts) == 3:
                date_part = f"{d_parts[2]}/{d_parts[1]}/{d_parts[0]}"
                
        tickets.append({
            "id": r["id"],
            "orderCode": r["order_id"],
            "performance": {
                "id": r["performance_id"],
                "name": r["performance_name"],
                "poster_url": r["poster_url"]
            },
            "seat": {
                "id": r["seat_id"],
                "row": r["seat_row"],
                "number": r["seat_number"]
            },
            "selectedDate": date_part,
            "selectedTime": time_part,
            "price": r["price"],
            "paymentMethod": r["payment_method"],
            "createdAt": r["created_at"]
        })
    conn.close()
    return jsonify(tickets)

@app.route('/api/performances', methods=['GET'])
def get_performances():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM performances')
    rows = c.fetchall()
    
    performances = []
    for r in rows:
        perf = dict(r)
        
        # Tính rating trung bình từ bảng ratings
        c.execute('SELECT AVG(rating) as avg_r, COUNT(*) as cnt FROM ratings WHERE performance_id = ?', (perf['id'],))
        rating_row = c.fetchone()
        avg_rating = round(rating_row['avg_r'], 1) if rating_row['avg_r'] else 0
        rating_count = rating_row['cnt'] or 0
        
        formatted = {
            "id": perf["id"],
            "src": perf["poster_url"],
            "alt": f"Poster {perf['title']}",
            "name": perf["title"],
            "duration": f"{perf['duration']} phút",
            "type": perf["type"],
            "description": perf["description"],
            "status": perf["status"],
            "rating": avg_rating,
            "ratingCount": rating_count
        }
        
        c.execute('''
            SELECT a.name, pa.character_name 
            FROM performance_artists pa
            JOIN artists a ON pa.artist_id = a.id
            WHERE pa.performance_id = ?
        ''', (perf["id"],))
        
        artists = c.fetchall()
        mainCast = []
        for a in artists:
            mainCast.append({"name": a["name"], "role": a["character_name"]})
            
        formatted["mainCast"] = mainCast
        formatted["supportingCast"] = []
        
        performances.append(formatted)
        
    conn.close()
    return jsonify(performances)

@app.route('/api/artists', methods=['GET'])
def get_artists():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM artists')
    rows = c.fetchall()
    
    artists = []
    for r in rows:
        artist = {
            "id": r["id"],
            "name": r["name"],
            "avatar": r["avatar_url"],
            "bio": r["bio"],
            "role_type": r["role_type"]
        }
        artists.append(artist)
        
    conn.close()
    return jsonify(artists)

@app.route('/api/news', methods=['GET'])
def get_news():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM news ORDER BY created_at DESC')
    rows = c.fetchall()
    
    news_list = []
    for r in rows:
        news = {
            "id": r["id"],
            "title": r["title"],
            "content": r["content"],
            "src": r["image_url"],
            "created_at": r["created_at"],
            "is_published": r["is_published"]
        }
        news_list.append(news)
        
    conn.close()
    return jsonify(news_list)

@app.route('/api/seats', methods=['GET'])
def get_seats():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT s.id, s.seat_row, s.seat_number, s.is_active, 
               t.name as type_name, t.price
        FROM seats s
        JOIN seat_types t ON s.seat_type_id = t.id
    ''')
    rows = c.fetchall()
    
    # Needs to match SeatsData.js structure, often a list of objects or a dict grouping by rows.
    # We will just return the raw array and handle it in the frontend if needed.
    seats = []
    for r in rows:
        seats.append({
            "id": r["id"],
            "row": r["seat_row"],
            "number": r["seat_number"],
            "status": "available" if r["is_active"] else "unavailable",
            "type": r["type_name"],
            "price": r["price"]
        })
        
    conn.close()
    return jsonify(seats)

@app.route('/api/plays', methods=['GET'])
def get_plays():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM plays ORDER BY start_time')
    rows = c.fetchall()
    
    plays = []
    for r in rows:
        # start_time is like "2026-01-15 20:00:00"
        dt_parts = str(r["start_time"]).split(" ")
        date_part = dt_parts[0] if len(dt_parts) > 0 else ""
        time_part = dt_parts[1][:5] if len(dt_parts) > 1 else ""
        
        # Map DB status -> frontend status label
        db_status = r["status"]
        if db_status == "active":
            front_status = "còn chỗ"
        elif db_status == "completed":
            front_status = "đã đóng"
        elif db_status == "cancelled":
            front_status = "đã đóng"
        elif db_status == "sold_out":
            front_status = "hết chỗ"
        else:
            front_status = "còn chỗ"  # default
        
        plays.append({
            "id": r["id"],
            "p_id": r["performance_id"],
            "date": date_part,
            "time": time_part,
            "status": front_status,
            "db_status": db_status
        })
        
    conn.close()
    return jsonify(plays)

@app.route('/api/ratings/<int:performance_id>', methods=['GET'])
def get_ratings(performance_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT r.id, r.rating, r.review, u.full_name as reviewer
        FROM ratings r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.performance_id = ?
        ORDER BY r.id DESC
    ''', (performance_id,))
    rows = c.fetchall()
    
    ratings = []
    for r in rows:
        ratings.append({
            "id": r["id"],
            "rating": r["rating"],
            "review": r["review"],
            "reviewer": r["reviewer"] or "Khán giả"
        })
    
    # avg
    c.execute('SELECT AVG(rating) as avg_r, COUNT(*) as cnt FROM ratings WHERE performance_id = ?', (performance_id,))
    agg = c.fetchone()
    avg = round(agg['avg_r'], 1) if agg['avg_r'] else 0
    
    conn.close()
    return jsonify({"avg": avg, "count": agg['cnt'], "reviews": ratings})

if __name__ == '__main__':
    init_db()
    app.run(host='127.0.0.1', port=5000, debug=True)
