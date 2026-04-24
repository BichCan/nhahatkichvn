from flask import Flask, jsonify, request, session
from flask_cors import CORS
import sqlite3
import os
import redis
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta

from db_utils import get_db_connection, DB_PATH
from adminapp import admin_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'nhahatkichvn_secret_key')
# CORS configuration - Allow all common development origins
CORS(app, supports_credentials=True, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://192.168.1.13:3000"
], allow_headers=["Content-Type", "Authorization", "X-Admin-ID"], methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])

app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=7)
)

# Register Blueprints
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

import threading
import time
import uuid

# Background thread for expiry
def run_background_cleanup():
    while True:
        time.sleep(60)
        try:
            import requests
            requests.post('http://127.0.0.1:5000/api/internal/cleanup')
        except:
            pass

# (PostgreSQL Pool removed)

# Session configuration for local development
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=1800 # 30 minutes
)

# DB_PATH and get_db_connection moved to db_utils.py

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    # Ensure users table exists
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL,
            phone TEXT
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

# Socket.IO Event Handlers
@socketio.on('connect')
def handle_connect():
    logger.info(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")


@app.route('/api/internal/cleanup', methods=['POST'])
def internal_cleanup():
    cleanup_expired_holds()
    return jsonify({"success": True})

def cleanup_expired_holds():
    """System job to cancel expired holding bookings and revert tickets"""
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            SELECT id, performance_id, show_date, show_time, seat_id 
            FROM bookings 
            WHERE status = 'holding' AND hold_expiry_time <= CURRENT_TIMESTAMP
        ''')
        expired_bookings = c.fetchall()
        
        for b in expired_bookings:
            c.execute("UPDATE bookings SET status = 'expired' WHERE id = ?", (b['id'],))
            db_start_time = f"{b['show_date']} {b['show_time']}:00"
            c.execute("SELECT id FROM plays WHERE performance_id = ? AND start_time = ?", (b['performance_id'], db_start_time))
            play_row = c.fetchone()
            if play_row:
                play_id = play_row['id']
                c.execute('''
                    UPDATE tickets 
                    SET status = 'available', held_by_user_id = NULL, hold_expired_at = NULL 
                    WHERE play_id = ? AND seat_id = ? AND status = 'holding'
                ''', (play_id, b['seat_id']))
                
            broadcast_seat_update(b['performance_id'], b['show_date'], b['show_time'])
        conn.commit()
    except Exception as e:
        logger.error(f"Lỗi dọn ghế: {e}")
    finally:
        conn.close()

def broadcast_seat_update(performance_id, date, time):
    """Gửi trạng thái ghế mới nhất"""
    seats_status = get_current_seat_status(performance_id, date, time)
    socketio.emit('seat_update', {'performance_id': performance_id, 'date': date, 'time': time, 'seats': seats_status})

def get_current_seat_status(performance_id, date, time):
    booked_seats = []
    holding_seats = {}
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            SELECT seat_id, user_id, hold_expiry_time
            FROM bookings 
            WHERE performance_id = ? AND show_date = ? AND show_time = ? AND status = 'holding' AND hold_expiry_time > CURRENT_TIMESTAMP
        ''', (performance_id, date, time))
        for row in c.fetchall():
            from datetime import datetime
            expiry = datetime.strptime(row['hold_expiry_time'], '%Y-%m-%d %H:%M:%S')
            ttl = (expiry - datetime.now()).total_seconds()
            holding_seats[row['seat_id']] = {
                "user_id": row['user_id'],
                "expires_in": int(ttl) if ttl > 0 else 0
            }
            
        c.execute('''
            SELECT seat_id
            FROM bookings 
            WHERE performance_id = ? AND show_date = ? AND show_time = ? AND status = 'converted'
        ''', (performance_id, date, time))
        booked_seats = [row['seat_id'] for row in c.fetchall()]
    finally:
        conn.close()
    return {"booked": booked_seats, "holding": holding_seats}

@app.route('/api/seat-status/<int:performance_id>', methods=['GET'])
def get_seat_status(performance_id):
    date = request.args.get('date')
    time_str = request.args.get('time')
    if not date or not time_str:
        return jsonify({"success": False, "message": "Thiếu date và time"}), 400
    try:
        return jsonify(get_current_seat_status(performance_id, date, time_str))
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/hold-seat', methods=['POST'])
def hold_seat():
    data = request.json
    performance_id = data.get('performance_id')
    date = data.get('date')
    time_str = data.get('time')
    seat_id = data.get('seat_id')
    user_id = data.get('user_id') or session.get('user_id')
    
    missing = []
    if not performance_id: missing.append('performance_id')
    if not date: missing.append('date')
    if not time_str: missing.append('time')
    if not seat_id: missing.append('seat_id')
    if not user_id: missing.append('user_id (Bạn cần đăng nhập trước khi chọn ghế)')
    
    if missing:
        return jsonify({"success": False, "message": f"Thiếu thông tin: {', '.join(missing)}"}), 400
        
    db_start_time = f"{date} {time_str}:00"
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute("SELECT id FROM plays WHERE performance_id = ? AND start_time = ?", (performance_id, db_start_time))
        play_row = c.fetchone()
        from datetime import datetime, timedelta
        import uuid
        now = datetime.now()
        now_str = now.strftime('%Y-%m-%d %H:%M:%S')
        
        if not play_row:
            c.execute('''
                INSERT INTO plays (performance_id, start_time, end_time, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (performance_id, db_start_time, db_start_time, 'active', now_str, now_str))
            play_id = c.lastrowid
        else:
            play_id = play_row['id']
            
        c.execute("SELECT id, status, held_by_user_id, hold_expired_at FROM tickets WHERE play_id = ? AND seat_id = ?", (play_id, seat_id))
        ticket_row = c.fetchone()
        
        if not ticket_row:
            c.execute('''
                INSERT INTO tickets (play_id, seat_id, price, status, created_at, updated_at)
                VALUES (?, ?, ?, 'available', ?, ?)
            ''', (play_id, seat_id, 0, now_str, now_str))
            ticket_id = c.lastrowid
        else:
            ticket_id = ticket_row['id']
            ticket_status = ticket_row['status']
            if ticket_status in ['paid', 'booked']:
                return jsonify({"success": False, "message": "Ghế đã có người đặt"}), 409
            if ticket_status == 'holding':
                exp = datetime.strptime(ticket_row['hold_expired_at'], '%Y-%m-%d %H:%M:%S') if ticket_row['hold_expired_at'] else None
                if exp and exp > now:
                    if str(ticket_row['held_by_user_id']) == str(user_id):
                        return jsonify({"success": True})
                    return jsonify({"success": False, "message": "Ghế đang bị giữ"}), 409

        expiry_time = now + timedelta(minutes=10)
        expiry_str = expiry_time.strftime('%Y-%m-%d %H:%M:%S')
        session_uid = str(uuid.uuid4())
        
        c.execute('''
            INSERT INTO bookings (user_id, performance_id, seat_id, seat_row, seat_number, show_date, show_time, price, payment_method, order_code, order_id, status, hold_start_time, hold_expiry_time, session_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'holding', ?, ?, ?)
        ''', (user_id, performance_id, seat_id, seat_id[0], seat_id[1:], date, time_str, 0, 'Hold', 'pending', 'pending', now_str, expiry_str, session_uid))
        booking_id = c.lastrowid
        
        c.execute('''
            UPDATE tickets 
            SET status = 'holding', held_by_user_id = ?, hold_expired_at = ?, updated_at = ?
            WHERE id = ?
        ''', (user_id, expiry_str, now_str, ticket_id))
        
        conn.commit()
        broadcast_seat_update(performance_id, date, time_str)
        return jsonify({"success": True, "hold_id": booking_id, "expires_at": expiry_time.isoformat()})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/cancel-hold', methods=['POST'])
def cancel_hold():
    data = request.json
    performance_id = data.get('performance_id')
    date = data.get('date')
    time_str = data.get('time')
    seat_id = data.get('seat_id')
    user_id = data.get('user_id') or session.get('user_id')
    
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            UPDATE bookings SET status = 'cancelled', cancelled_reason = 'user_cancelled'
            WHERE performance_id = ? AND show_date = ? AND show_time = ? AND seat_id = ? AND user_id = ? AND status = 'holding'
        ''', (performance_id, date, time_str, seat_id, user_id))
        
        db_start_time = f"{date} {time_str}:00"
        c.execute("SELECT id FROM plays WHERE performance_id = ? AND start_time = ?", (performance_id, db_start_time))
        play_row = c.fetchone()
        if play_row:
            c.execute('''
                UPDATE tickets SET status = 'available', held_by_user_id = NULL, hold_expired_at = NULL 
                WHERE play_id = ? AND seat_id = ? AND status = 'holding' AND held_by_user_id = ?
            ''', (play_row['id'], seat_id, user_id))
            
        conn.commit()
        broadcast_seat_update(performance_id, date, time_str)
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/bookings', methods=['POST'])
def create_order():
    data = request.json
    bookings = data.get('bookings')
    if not bookings:
        return jsonify({"success": False, "message": "Không có thông tin đặt vé"}), 400
        
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"success": False, "message": "Bạn chưa đăng nhập"}), 401
        
    try:
        conn = get_db_connection()
        c = conn.cursor()
        now = datetime.now()
        now_str = now.strftime('%Y-%m-%d %H:%M:%S')
        
        # Calculate total with 8% VAT
        subtotal = sum(float(b.get('price', 0)) for b in bookings)
        total_with_vat = round(subtotal * 1.08, 0)
        
        payment_method = data.get('payment_method', 'cash')
        payment_status = 'paid' if payment_method in ['vnpay', 'shopeepay', 'bank'] else 'pending'
        
        order_id = f"ORD-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # 1. Create entry in orders table
        c.execute('''
            INSERT INTO orders (order_id, user_id, total_amount, payment_status, payment_method, payment_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (order_id, user_id, total_with_vat, payment_status, payment_method, now_str if payment_status == 'paid' else None, now_str, now_str))
        
        for b in bookings:
            # 2. Update corresponding bookings records
            c.execute('''
                UPDATE bookings 
                SET order_id = ?, order_code = ?, status = 'converted'
                WHERE user_id = ? AND performance_id = ? AND seat_id = ? AND show_date = ? AND show_time = ?
            ''', (order_id, order_id, user_id, b['performance_id'], b['seat_id'], b['show_date'], b['show_time']))
            
            # 3. Update related tickets records
            db_start_time = f"{b['show_date']} {b['show_time']}:00"
            c.execute("SELECT id FROM plays WHERE performance_id = ? AND start_time = ?", (b['performance_id'], db_start_time))
            play_row = c.fetchone()
            if play_row:
                ticket_status = 'paid' if payment_status == 'paid' else 'booked'
                c.execute('''
                    UPDATE tickets 
                    SET status = ?, order_id = ?, price = ?, updated_at = ?
                    WHERE play_id = ? AND seat_id = ?
                ''', (ticket_status, order_id, b.get('price'), now_str, play_row['id'], b['seat_id']))
                
        conn.commit()
        
        # Broadcast updates for affected performances
        # Use a set to avoid redundant broadcasts for the same performance
        performances = set((b['performance_id'], b['show_date'], b['show_time']) for b in bookings)
        for pid, d, t in performances:
            broadcast_seat_update(pid, d, t)
            
        return jsonify({
            "success": True, 
            "order_id": order_id, 
            "message": "Đặt vé thành công",
            "total_amount": total_with_vat
        })
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
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
        session['user_role'] = user['role']
        session['user_name'] = user['full_name']
        session['user_email'] = user['email']
        session['user_phone'] = user['phone']
        return jsonify({
            "success": True, 
            "message": "Đăng nhập thành công",
            "user": {
                "id": user['id'],
                "full_name": user['full_name'],
                "email": user['email'],
                "phone": user['phone'],
                "role": user['role']
            }
        })
    else:
        return jsonify({"success": False, "message": "Email hoặc mật khẩu không chính xác"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    phone = data.get('phone')
    
    if not email or not password or not full_name or not phone:
        return jsonify({"success": False, "message": "Vui lòng nhập đầy đủ thông tin"}), 400
        
    conn = get_db_connection()
    c = conn.cursor()
    
    # Check if email already exists
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    if c.fetchone():
        conn.close()
        return jsonify({"success": False, "message": "Email này đã được đăng ký"}), 400
        
    try:
        c.execute('INSERT INTO users (email, password, full_name, phone) VALUES (?, ?, ?, ?)', (email, password, full_name, phone))
        conn.commit()
        return jsonify({"success": True, "message": "Đăng ký thành công! Vui lòng đăng nhập."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        user_id = session['user_id']
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT id, full_name, email, phone FROM users WHERE id = ?', (user_id,))
        user = c.fetchone()
        conn.close()
        
        if user:
            # Sync session just in case
            session['user_name'] = user['full_name']
            session['user_email'] = user['email']
            session['user_phone'] = user['phone']
            
            return jsonify({
                "logged_in": True,
                "user": {
                    "id": user['id'],
                    "full_name": user['full_name'],
                    "email": user['email'],
                    "phone": user['phone'] or ''
                }
            })
    return jsonify({"logged_in": False})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Đã đăng xuất"})

@app.route('/api/user/update-profile', methods=['POST'])
def update_profile():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Vui lòng đăng nhập"}), 401
    
    data = request.json
    full_name = data.get('full_name')
    email = data.get('email')
    phone = data.get('phone')
    
    if not full_name or not email:
        return jsonify({"success": False, "message": "Họ tên và email không được để trống"}), 400
        
    user_id = session['user_id']
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        # Check if email is taken by another user
        c.execute('SELECT id FROM users WHERE email = ? AND id != ?', (email, user_id))
        if c.fetchone():
            return jsonify({"success": False, "message": "Email này đã được sử dụng bởi tài khoản khác"}), 400
            
        c.execute('''
            UPDATE users 
            SET full_name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (full_name, email, phone, user_id))
        conn.commit()
        
        # Update session
        session['user_name'] = full_name
        session['user_email'] = email
        session['user_phone'] = phone
        
        return jsonify({
            "success": True, 
            "message": "Cập nhật thông tin thành công",
            "user": {
                "id": user_id,
                "full_name": full_name,
                "email": email,
                "phone": phone
            }
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/user/change-password', methods=['POST'])
def change_password():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Vui lòng đăng nhập"}), 401
        
    data = request.json
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if not old_password or not new_password:
        return jsonify({"success": False, "message": "Vui lòng nhập đầy đủ mật khẩu cũ và mới"}), 400
        
    user_id = session['user_id']
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('SELECT password FROM users WHERE id = ?', (user_id,))
        row = c.fetchone()
        if not row or row['password'] != old_password:
            return jsonify({"success": False, "message": "Mật khẩu cũ không chính xác"}), 401
            
        c.execute('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (new_password, user_id))
        conn.commit()
        return jsonify({"success": True, "message": "Đổi mật khẩu thành công"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/bookings', methods=['GET', 'POST'])
def handle_bookings():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Vui lòng đăng nhập"}), 401
    
    user_id = session['user_id']
    conn = get_db_connection()
    c = conn.cursor()
    
    if request.method == 'POST':
        data = request.json
        bookings = data.get('bookings', [])
        if not bookings:
             return jsonify({"success": False, "message": "Không có thông tin đặt vé"}), 400
             
        try:
            import uuid
            from datetime import datetime
            now = datetime.now()
            now_str = now.strftime('%Y-%m-%d %H:%M:%S')
            
            # Extract common info from first booking (assuming all from same order)
            total_amount = sum(b['price'] for b in bookings)
            vat_amount = total_amount * 1.08
            
            payment_method = bookings[0].get('payment_method')
            payment_status = 'paid' if payment_method in ['vnpay', 'shopeepay', 'bank'] else 'pending'
            payment_date = now_str if payment_status == 'paid' else None
            
            order_id = f"ORD-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
            
            # 1. Insert Order
            c.execute('''
                INSERT INTO orders (
                    order_id, user_id, total_amount, payment_status, payment_method,
                    payment_date, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                order_id, user_id, vat_amount, payment_status, payment_method,
                payment_date, now_str, now_str
            ))
            
            for b in bookings:
                # show_date might be DD/MM/YYYY or YYYY-MM-DD
                date_str = b['show_date']
                if '/' in date_str:
                    date_parts = date_str.split('/')
                    db_date = f"{date_parts[2]}-{date_parts[1]}-{date_parts[0]}"
                else:
                    db_date = date_str
                    
                db_start_time = f"{db_date} {b['show_time']}:00"
                
                # Update holding booking status to converted
                c.execute('''
                    UPDATE bookings 
                    SET status = 'converted', converted_to_order_id = ?, price = ?, order_code = ?
                    WHERE user_id = ? AND performance_id = ? AND seat_id = ? AND status = 'holding'
                ''', (order_id, b['price'], b['order_code'], user_id, b['performance_id'], b['seat_id']))
                
                # Get play_id
                c.execute("SELECT id FROM plays WHERE performance_id = ? AND start_time = ?", (b['performance_id'], db_start_time))
                play_row = c.fetchone()
                if not play_row:
                    raise Exception("Không tìm thấy suất diễn")
                play_id = play_row['id']
                
                # Update ticket
                ticket_status = 'paid' if payment_status == 'paid' else 'booked'
                
                c.execute('''
                    UPDATE tickets 
                    SET status = ?, order_id = ?, price = ?, hold_expired_at = NULL, updated_at = ?
                    WHERE play_id = ? AND seat_id = ?
                ''', (ticket_status, order_id, b['price'], now_str, play_id, b['seat_id']))
                
                # Get ticket_id to insert to order_details
                c.execute("SELECT id FROM tickets WHERE play_id = ? AND seat_id = ?", (play_id, b['seat_id']))
                ticket_id_row = c.fetchone()
                if ticket_id_row:
                    c.execute('''
                        INSERT INTO order_details (order_id, ticket_id, price)
                        VALUES (?, ?, ?)
                    ''', (order_id, ticket_id_row['id'], b['price']))
                
                broadcast_seat_update(b['performance_id'], db_date, b['show_time'])
                
            conn.commit()
            return jsonify({"success": True, "message": "Đặt vé thành công", "order_id": order_id})
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
        SELECT t.id, t.order_id, o.payment_method, o.payment_status, o.admin_confirmed_by,
               t.price, t.status as ticket_status, t.hold_expired_at, t.created_at,
               p.id as performance_id, p.title as performance_name, p.poster_url,
               s.seat_row, s.seat_number, s.id as seat_id,
               pl.start_time
        FROM tickets t
        LEFT JOIN orders o ON t.order_id = o.order_id
        JOIN plays pl ON t.play_id = pl.id
        JOIN performances p ON pl.performance_id = p.id
        JOIN seats s ON (
               Cast(t.seat_id as text) = Cast(s.id as text) 
               OR t.seat_id = s.seat_row || s.seat_number
        )
        WHERE (o.user_id = ? OR t.held_by_user_id = ?)
        ORDER BY t.created_at DESC
    ''', (user_id, user_id))
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
            "paymentStatus": r["payment_status"],
            "adminConfirmed": bool(r["admin_confirmed_by"]),
            "status": r["ticket_status"],
            "holdExpiredAt": r["hold_expired_at"],
            "createdAt": r["created_at"]
        })
    conn.close()
    return jsonify(tickets)

@app.route('/api/orders/cancel', methods=['POST'])
def cancel_order():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Vui lòng đăng nhập"}), 401
    
    data = request.json
    order_id = data.get('order_id')
    if not order_id:
        return jsonify({"success": False, "message": "Thiếu mã đơn hàng"}), 400
        
    user_id = session['user_id']
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        # Check if order belongs to user and is pending
        c.execute('SELECT * FROM orders WHERE order_id = ? AND user_id = ?', (order_id, user_id))
        order = c.fetchone()
        if not order:
            return jsonify({"success": False, "message": "Không tìm thấy đơn hàng"}), 404
        
        if order['payment_status'] != 'pending':
            return jsonify({"success": False, "message": "Chỉ có thể hủy đơn hàng đang chờ thanh toán"}), 400
            
        # 1. Update order status
        c.execute('UPDATE orders SET payment_status = ? WHERE order_id = ?', ('cancelled', order_id))
        
        # 2. Update tickets status
        c.execute('UPDATE tickets SET status = ?, order_id = NULL, held_by_user_id = NULL, hold_expired_at = NULL WHERE order_id = ?', ('available', order_id))
        
        # 3. Update bookings status
        c.execute("UPDATE bookings SET status = 'cancelled' WHERE order_id = ?", (order_id,))
        
        conn.commit()
        
        # Optional: broadcast update (though cleanup handles this too)
        # We should find out performance info to broadcast
        c.execute('''
            SELECT DISTINCT b.performance_id, b.show_date, b.show_time 
            FROM bookings b 
            WHERE b.order_id = ?
        ''', (order_id,))
        for b in c.fetchall():
            broadcast_seat_update(b['performance_id'], b['show_date'], b['show_time'])
            
        return jsonify({"success": True, "message": "Đã hủy đơn hàng thành công"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

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
            "role_type": r["role_type"],
            "status": r["status"]
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

@app.route('/api/ratings', methods=['POST'])
def post_rating():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Vui lòng đăng nhập để gửi đánh giá"}), 401
    
    data = request.json
    performance_id = data.get('performance_id')
    rating = data.get('rating')
    review = data.get('review')
    user_id = session['user_id']
    
    if not performance_id or not rating:
        return jsonify({"success": False, "message": "Thiếu thông tin đánh giá"}), 400
    
    if not (1 <= int(rating) <= 5):
        return jsonify({"success": False, "message": "Đánh giá không hợp lệ (1-5)"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            INSERT INTO ratings (user_id, performance_id, rating, review)
            VALUES (?, ?, ?, ?)
        ''', (user_id, performance_id, rating, review))
        conn.commit()
        return jsonify({"success": True, "message": "Cảm ơn bạn đã đánh giá!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    threading.Thread(target=run_background_cleanup, daemon=True).start()
    init_db()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
