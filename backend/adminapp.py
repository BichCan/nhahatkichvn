from flask import Blueprint, jsonify, request, session
from db_utils import get_db_connection
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

admin_bp = Blueprint('admin', __name__)

# Configure Upload Folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'public', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"success": False, "message": "Email và mật khẩu không được để trống"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
        user = c.fetchone()
        
        if user:
            if user['role'] != 'admin':
                return jsonify({"success": False, "message": "Tài khoản của bạn không có quyền truy cập trang quản trị"}), 403
                
            session.permanent = True
            session['user_id'] = user['id']
            session['user_name'] = user['full_name']
            session['user_email'] = user['email']
            session['user_role'] = user['role']
            
            return jsonify({
                "success": True, 
                "message": "Đăng nhập Admin thành công",
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
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

def verify_admin_status(request_data=None):
    """
    Helper to verify admin status from session or validated fallback.
    Returns (admin_id, error_response)
    """
    # 1. Try session first
    if 'user_id' in session and session.get('user_role') == 'admin':
        return session.get('user_id'), None
        
    # 2. Try fallback from request body/params/headers if provided
    admin_id = None
    if request_data:
        admin_id = request_data.get('admin_id')
    
    if not admin_id:
        admin_id = request.headers.get('X-Admin-ID') or request.args.get('admin_id')

    if admin_id:
        conn = get_db_connection()
        try:
            c = conn.cursor()
            c.execute('SELECT id, role FROM users WHERE id = ?', (admin_id,))
            user = c.fetchone()
            if user and user['role'] == 'admin':
                return user['id'], None
        finally:
            conn.close()
            
    return None, (jsonify({"success": False, "message": "Vui lòng đăng nhập với quyền admin"}), 401)

@admin_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "Không tìm thấy file"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "Chưa chọn file"}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Return the public URL
        return jsonify({
            "success": True, 
            "url": f"/uploads/{filename}"
        })
    
    return jsonify({"success": False, "message": "Định dạng file không được hỗ trợ"}), 400

# News Management Routes
@admin_bp.route('/news', methods=['POST'])
def create_news():
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')
    
    if not title or not content:
        return jsonify({"success": False, "message": "Vui lòng nhập đầy đủ tiêu đề và nội dung"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            INSERT INTO news (title, content, image_url, admin_id, created_at, is_published)
            VALUES (?, ?, ?, ?, datetime('now'), 1)
        ''', (title, content, image_url, admin_id))
        conn.commit()
        return jsonify({"success": True, "message": "Thêm tin tức thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/news/<int:news_id>', methods=['PUT'])
def update_news(news_id):
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')
    
    if not title or not content:
        return jsonify({"success": False, "message": "Tiêu đề và nội dung không được để trống"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            UPDATE news 
            SET title = ?, content = ?, image_url = ?
            WHERE id = ?
        ''', (title, content, image_url, news_id))
        conn.commit()
        return jsonify({"success": True, "message": "Cập nhật tin tức thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/news/<int:news_id>', methods=['DELETE'])
def delete_news(news_id):
    # For DELETE, fallback admin_id can be in query params or headers
    admin_id_fallback = request.args.get('admin_id') or request.headers.get('X-Admin-ID')
    admin_id, error = verify_admin_status({'admin_id': admin_id_fallback})
    if error: return error
         
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('DELETE FROM news WHERE id = ?', (news_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Đã xóa bài viết"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/news/<int:news_id>/toggle-status', methods=['PATCH'])
def toggle_news_status(news_id):
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
         
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('UPDATE news SET is_published = NOT is_published WHERE id = ?', (news_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Cập nhật trạng thái thành công"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

# Artist Management Routes
@admin_bp.route('/artists', methods=['POST'])
def create_artist():
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    name = data.get('name')
    bio = data.get('bio')
    role_type = data.get('role_type')
    avatar_url = data.get('avatar_url')
    status = data.get('status', 'ACTIVE')
    
    if not name:
        return jsonify({"success": False, "message": "Vui lòng nhập tên nghệ sĩ"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            INSERT INTO artists (name, bio, role_type, avatar_url, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, bio, role_type, avatar_url, status))
        conn.commit()
        return jsonify({"success": True, "message": "Thêm nghệ sĩ thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/artists/<int:artist_id>', methods=['PUT'])
def update_artist(artist_id):
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    name = data.get('name')
    bio = data.get('bio')
    role_type = data.get('role_type')
    avatar_url = data.get('avatar_url')
    status = data.get('status')
    
    if not name:
        return jsonify({"success": False, "message": "Tên nghệ sĩ không được để trống"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            UPDATE artists 
            SET name = ?, bio = ?, role_type = ?, avatar_url = ?, status = ?
            WHERE id = ?
        ''', (name, bio, role_type, avatar_url, status, artist_id))
        conn.commit()
        return jsonify({"success": True, "message": "Cập nhật nghệ sĩ thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/artists/<int:artist_id>', methods=['DELETE'])
def delete_artist(artist_id):
    # Fallback to query params or headers for DELETE as body is often empty
    admin_id_fallback = request.args.get('admin_id') or request.headers.get('X-Admin-ID')
    admin_id, error = verify_admin_status({'admin_id': admin_id_fallback})
    if error: return error
         
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('DELETE FROM artists WHERE id = ?', (artist_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Đã xóa nghệ sĩ"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

# Order & Payment Management Routes
@admin_bp.route('/orders', methods=['GET'])
def get_orders():
    if 'user_role' in session and session['user_role'] != 'admin':
         return jsonify({"success": False, "message": "Bạn không có quyền truy cập"}), 403
         
    conn = get_db_connection()
    try:
        c = conn.cursor()
        # Auto-cancel expired pending orders
        c.execute('''
            UPDATE orders 
            SET payment_status = 'cancelled' 
            WHERE payment_status = 'pending' 
            AND (
                (expired_at IS NOT NULL AND datetime(expired_at) < datetime('now'))
                OR 
                (expired_at IS NULL AND datetime(created_at, '+24 hours') < datetime('now'))
            )
        ''')
        conn.commit()

        # Query joining orders with user info and aggregating performance titles
        c.execute('''
            SELECT 
                o.order_id, 
                o.user_id, 
                o.total_amount, 
                o.payment_status, 
                o.payment_method, 
                o.payment_date,
                o.created_at,
                o.note,
                u.full_name as customer_name,
                u.phone as customer_phone,
                COALESCE(
                    (SELECT p.title FROM performances p 
                     JOIN plays pl ON p.id = pl.performance_id 
                     JOIN tickets t ON pl.id = t.play_id 
                     WHERE t.order_id = o.order_id LIMIT 1),
                    (SELECT p.title FROM performances p 
                     JOIN bookings b ON p.id = b.performance_id 
                     WHERE b.order_id = o.order_id OR b.converted_to_order_id = o.order_id LIMIT 1),
                    (SELECT p.title FROM performances p 
                     JOIN plays pl ON p.id = pl.performance_id 
                     JOIN tickets t ON pl.id = t.play_id 
                     JOIN order_details od ON t.id = od.ticket_id 
                     WHERE od.order_id = o.order_id LIMIT 1)
                ) as performance_title,
                COALESCE(
                    (SELECT pl.start_time FROM plays pl 
                     JOIN tickets t ON pl.id = t.play_id 
                     WHERE t.order_id = o.order_id LIMIT 1),
                    (SELECT b.show_date || ' ' || b.show_time FROM bookings b 
                     WHERE b.order_id = o.order_id OR b.converted_to_order_id = o.order_id LIMIT 1),
                    (SELECT pl.start_time FROM plays pl 
                     JOIN tickets t ON pl.id = t.play_id 
                     JOIN order_details od ON t.id = od.ticket_id 
                     WHERE od.order_id = o.order_id LIMIT 1)
                ) as showtime
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ''')
        orders = [dict(row) for row in c.fetchall()]
        return jsonify({"success": True, "orders": orders})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/orders/<string:order_id>/details', methods=['GET'])
def get_order_details(order_id):
    if 'user_role' in session and session['user_role'] != 'admin':
         return jsonify({"success": False, "message": "Bạn không có quyền truy cập"}), 403
         
    conn = get_db_connection()
    try:
        c = conn.cursor()
        # Get seats for this order - Try via order_details first
        c.execute('''
            SELECT 
                s.seat_row, 
                s.seat_number, 
                p.id as performance_id,
                p.title as performance_title,
                pl.id as play_id,
                pl.start_time as showtime,
                od.price
            FROM order_details od
            JOIN tickets t ON od.ticket_id = t.id
            JOIN seats s ON t.seat_id = s.id
            JOIN plays pl ON t.play_id = pl.id
            JOIN performances p ON pl.performance_id = p.id
            WHERE od.order_id = ?
        ''', (order_id,))
        items = [dict(row) for row in c.fetchall()]
        
        # Fallback to tickets table directly if order_details is empty
        if not items:
            c.execute('''
                SELECT 
                    s.seat_row, 
                    s.seat_number, 
                    p.title as performance_title,
                    pl.start_time as showtime,
                    t.price
                FROM tickets t
                JOIN seats s ON t.seat_id = s.id
                JOIN plays pl ON t.play_id = pl.id
                JOIN performances p ON pl.performance_id = p.id
                WHERE t.order_id = ?
            ''', (order_id,))
            items = [dict(row) for row in c.fetchall()]
        
        # Fallback 2: Try via bookings table if still empty
        if not items:
            c.execute('''
                SELECT 
                    b.seat_row, 
                    b.seat_number, 
                    p.title as performance_title,
                    b.show_date || ' ' || b.show_time as showtime,
                    b.price
                FROM bookings b
                LEFT JOIN performances p ON b.performance_id = p.id
                WHERE b.order_id = ? OR b.order_code = ?
            ''', (order_id, order_id))
            items = [dict(row) for row in c.fetchall()]
        
        # Also get order info for expiry check
        c.execute('SELECT created_at, expired_at FROM orders WHERE order_id = ?', (order_id,))
        order_info = c.fetchone()
        
        return jsonify({
            "success": True, 
            "items": items,
            "created_at": order_info['created_at'] if order_info else None,
            "expire_at": order_info['expired_at'] if order_info else None
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/orders/<string:order_id>', methods=['PUT'])
def update_order_admin(order_id):
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    bookings = data.get('bookings', [])
    payment_method = data.get('payment_method', 'cash')
    
    if not bookings:
        return jsonify({"success": False, "message": "Danh sách đặt vé không được để trống"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        
        # 1. Get play_id for the first booking to ensure we have a play
        perf_id = bookings[0].get('performance_id')
        show_date = bookings[0].get('show_date')
        show_time = bookings[0].get('show_time')
        
        db_start_time = f"{show_date} {show_time}:00"
        c.execute('SELECT id FROM plays WHERE performance_id = ? AND start_time = ?', 
                  (perf_id, db_start_time))
        play = c.fetchone()
        if not play:
            return jsonify({"success": False, "message": "Không tìm thấy suất diễn tương ứng"}), 404
        play_id = play['id']

        # 2. Delete existing details and tickets for this order
        # Important: only if they are not already paid/confirmed in a way that prevents edit
        c.execute('DELETE FROM order_details WHERE order_id = ?', (order_id,))
        c.execute('DELETE FROM tickets WHERE order_id = ?', (order_id,))
        
        # 3. Re-insert new tickets and details
        total_amount = 0
        for b in bookings:
            seat_id = b.get('seat_id')
            price = b.get('price', 0)
            total_amount += price
            
            # Upsert ticket
            c.execute('''
                INSERT INTO tickets (play_id, seat_id, order_id, status, price)
                VALUES (?, ?, ?, 'booked', ?)
            ''', (play_id, seat_id, order_id, price))
            ticket_id = c.lastrowid
            
            # Insert order detail
            c.execute('''
                INSERT INTO order_details (order_id, ticket_id, price)
                VALUES (?, ?, ?)
            ''', (order_id, ticket_id, price))
            
        # 4. Update order total and payment method
        # Note: total_amount * 1.08 for tax as per frontend logic? 
        # Actually, let's just use the sum and let the frontend calculate or be consistent.
        # Most of our logic uses 1.08.
        final_total = total_amount * 1.08
        
        c.execute('''
            UPDATE orders 
            SET total_amount = ?, payment_method = ?
            WHERE order_id = ?
        ''', (final_total, payment_method, order_id))
        
        conn.commit()
        return jsonify({"success": True, "message": "Cập nhật đơn hàng thành công!"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/orders/<string:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    status = data.get('status')
    if not status:
        return jsonify({"success": False, "message": "Thiếu trạng thái cập nhật"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        # Update status and set payment_date if paid
        if status == 'paid':
            c.execute('''
                UPDATE orders 
                SET payment_status = ?, payment_date = datetime('now'), admin_confirmed_by = ?
                WHERE order_id = ?
            ''', (status, admin_id, order_id))
        else:
            c.execute('''
                UPDATE orders 
                SET payment_status = ? 
                WHERE order_id = ?
            ''', (status, order_id))
            
        conn.commit()
        return jsonify({"success": True, "message": f"Cập nhật trạng thái {status} thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/orders/<string:order_id>', methods=['DELETE'])
def delete_order(order_id):
    admin_id_fallback = request.args.get('admin_id') or request.headers.get('X-Admin-ID')
    admin_id, error = verify_admin_status({'admin_id': admin_id_fallback})
    if error: return error
          
    conn = get_db_connection()
    try:
        c = conn.cursor()
        # Protection: do not delete paid orders
        c.execute('SELECT payment_status FROM orders WHERE order_id = ?', (order_id,))
        order = c.fetchone()
        if order and order['payment_status'] == 'paid':
            return jsonify({"success": False, "message": "Không thể xóa đơn hàng đã thanh toán"}), 400

        c.execute('DELETE FROM orders WHERE order_id = ?', (order_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Đã xóa đơn hàng"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/users', methods=['GET'])
def get_users():
    # Admin verification
    admin_id_fallback = request.args.get('admin_id') or request.headers.get('X-Admin-ID')
    admin_id, error = verify_admin_status({'admin_id': admin_id_fallback})
    if error: return error
    
    query = request.args.get('q', '')
    conn = get_db_connection()
    try:
        c = conn.cursor()
        if query:
            c.execute("SELECT id, full_name, email, phone FROM users WHERE (full_name LIKE ? OR phone LIKE ?) AND role != 'admin' LIMIT 10", 
                      (f'%{query}%', f'%{query}%'))
        else:
            c.execute("SELECT id, full_name, email, phone FROM users WHERE role != 'admin' LIMIT 10")
        users = [dict(row) for row in c.fetchall()]
        return jsonify({"success": True, "users": users})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/orders/create-for-user', methods=['POST'])
def create_order_for_user():
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    user_id = data.get('user_id')
    bookings = data.get('bookings')
    payment_method = data.get('payment_method', 'cash')
    
    if not user_id or not bookings:
        return jsonify({"success": False, "message": "Thiếu thông tin khách hàng hoặc vé"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        now = datetime.now()
        now_str = now.strftime('%Y-%m-%d %H:%M:%S')
        
        # Calculate total with 8% VAT
        subtotal = sum(float(b.get('price', 0)) for b in bookings)
        total_with_vat = round(subtotal * 1.08, 0)
        
        order_id = f"ORD-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        payment_status = 'pending' # Usually pending until cash collected
        
        # 1. Create order
        c.execute('''
            INSERT INTO orders (order_id, user_id, total_amount, payment_status, payment_method, created_at, updated_at, admin_confirmed_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (order_id, user_id, total_with_vat, payment_status, payment_method, now_str, now_str, admin_id))
        
        for b in bookings:
            # Find play_id
            db_start_time = f"{b['show_date']} {b['show_time']}:00"
            c.execute("SELECT id FROM plays WHERE performance_id = ? AND start_time = ?", (b['performance_id'], db_start_time))
            play_row = c.fetchone()
            if not play_row: continue
            
            play_id = play_row['id']
            
            # Find actual seat_id (integer) from seats table
            c.execute("SELECT id FROM seats WHERE seat_row = ? AND seat_number = ?", (b['seat_row'], b['seat_number']))
            seat_db_row = c.fetchone()
            if not seat_db_row: continue
            seat_db_id = seat_db_row['id']
            
            # 3. Ensure ticket exists and update it
            c.execute("SELECT id FROM tickets WHERE play_id = ? AND seat_id = ?", (play_id, seat_db_id))
            ticket_row = c.fetchone()
            
            if not ticket_row:
                # Create ticket if it doesn't exist
                c.execute('''
                    INSERT INTO tickets (play_id, seat_id, status, order_id, price, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (play_id, seat_db_id, 'booked', order_id, b.get('price'), now_str, now_str))
                ticket_id = c.lastrowid
            else:
                # Update existing ticket
                ticket_id = ticket_row['id']
                c.execute('''
                    UPDATE tickets 
                    SET status = 'booked', order_id = ?, price = ?, updated_at = ?
                    WHERE id = ?
                ''', (order_id, b.get('price'), now_str, ticket_id))
            
            # 4. Insert into order_details
            if ticket_id:
                c.execute('''
                    INSERT INTO order_details (order_id, ticket_id, price)
                    VALUES (?, ?, ?)
                ''', (order_id, ticket_id, b.get('price')))

        conn.commit()
        return jsonify({"success": True, "order_id": order_id, "message": "Tạo đơn hàng thành công"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

# Performance Management Routes
@admin_bp.route('/performances', methods=['GET'])
def get_performances_admin():
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('SELECT * FROM performances ORDER BY created_at DESC')
        performances = [dict(row) for row in c.fetchall()]
        
        # For each performance, get its plays and artists_cast
        for p in performances:
            c.execute('SELECT * FROM plays WHERE performance_id = ? ORDER BY start_time ASC', (p['id'],))
            p['plays'] = [dict(row) for row in c.fetchall()]
            c.execute('''
                SELECT pa.artist_id, pa.character_name, a.name as artist_name, a.role_type
                FROM performance_artists pa
                JOIN artists a ON pa.artist_id = a.id
                WHERE pa.performance_id = ?
            ''', (p['id'],))
            p['artists_cast'] = [dict(row) for row in c.fetchall()]
            
        return jsonify({"success": True, "performances": performances})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/performances', methods=['POST'])
def create_performance():
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    title = data.get('title')
    description = data.get('description')
    duration = data.get('duration', 120)
    perf_type = data.get('type')
    poster_url = data.get('poster_url')
    status = data.get('status', 'active')
    rating_avg = data.get('rating_avg', 0)
    rating_count = data.get('rating_count', 0)
    cast = data.get('cast', [])  # [{artist_id, character_name}]
    
    if not title:
        return jsonify({"success": False, "message": "Vui lòng nhập tên vở diễn"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            INSERT INTO performances (title, description, duration, type, poster_url, status, rating_avg, rating_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (title, description, duration, perf_type, poster_url, status, rating_avg, rating_count))
        perf_id = c.lastrowid
        
        # Insert cast
        for member in cast:
            c.execute(
                'INSERT INTO performance_artists (performance_id, artist_id, character_name) VALUES (?, ?, ?)',
                (perf_id, member.get('artist_id'), member.get('character_name', ''))
            )
        
        conn.commit()
        return jsonify({"success": True, "message": "Thêm vở diễn thành công!"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/performances/<int:perf_id>', methods=['PUT'])
def update_performance(perf_id):
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    title = data.get('title')
    description = data.get('description')
    duration = data.get('duration')
    perf_type = data.get('type')
    poster_url = data.get('poster_url')
    status = data.get('status')
    rating_avg = data.get('rating_avg', 0)
    rating_count = data.get('rating_count', 0)
    cast = data.get('cast', [])  # [{artist_id, character_name}]
    
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            UPDATE performances 
            SET title = ?, description = ?, duration = ?, type = ?, poster_url = ?, status = ?,
                rating_avg = ?, rating_count = ?, updated_at = datetime('now')
            WHERE id = ?
        ''', (title, description, duration, perf_type, poster_url, status, rating_avg, rating_count, perf_id))
        
        # Replace cast: delete old, insert new
        c.execute('DELETE FROM performance_artists WHERE performance_id = ?', (perf_id,))
        for member in cast:
            c.execute(
                'INSERT INTO performance_artists (performance_id, artist_id, character_name) VALUES (?, ?, ?)',
                (perf_id, member.get('artist_id'), member.get('character_name', ''))
            )
        
        conn.commit()
        return jsonify({"success": True, "message": "Cập nhật vở diễn thành công!"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/performances/<int:perf_id>', methods=['DELETE'])
def delete_performance(perf_id):
    admin_id_fallback = request.args.get('admin_id') or request.headers.get('X-Admin-ID')
    admin_id, error = verify_admin_status({'admin_id': admin_id_fallback})
    if error: return error
          
    conn = get_db_connection()
    try:
        c = conn.cursor()
        # Check if there are any booked tickets for this performance
        c.execute('''
            SELECT count(*) as cnt FROM tickets t
            JOIN plays pl ON t.play_id = pl.id
            WHERE pl.performance_id = ? AND t.status IN ('paid', 'booked')
        ''', (perf_id,))
        if c.fetchone()['cnt'] > 0:
            return jsonify({"success": False, "message": "Không thể xóa vở diễn đã có người đặt vé"}), 400
            
        c.execute('DELETE FROM plays WHERE performance_id = ?', (perf_id,))
        c.execute('DELETE FROM performances WHERE id = ?', (perf_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Đã xóa vở diễn"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

# Play (Showtime) Management
@admin_bp.route('/plays', methods=['POST'])
def create_play():
    data = request.json
    admin_id, error = verify_admin_status(data)
    if error: return error
    
    perf_id = data.get('performance_id')
    start_time = data.get('start_time') # Expected 'YYYY-MM-DD HH:MM:00'
    end_time = data.get('end_time')
    status = data.get('status', 'available')
    
    if not perf_id or not start_time:
        return jsonify({"success": False, "message": "Thiếu thông tin suất diễn"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            INSERT INTO plays (performance_id, start_time, end_time, status)
            VALUES (?, ?, ?, ?)
        ''', (perf_id, start_time, end_time or start_time, status))
        conn.commit()
        return jsonify({"success": True, "message": "Thêm suất diễn thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

@admin_bp.route('/plays/<int:play_id>', methods=['DELETE'])
def delete_play(play_id):
    admin_id_fallback = request.args.get('admin_id') or request.headers.get('X-Admin-ID')
    admin_id, error = verify_admin_status({'admin_id': admin_id_fallback})
    if error: return error
          
    conn = get_db_connection()
    try:
        c = conn.cursor()
        # Check for bookings
        c.execute("SELECT count(*) as cnt FROM tickets WHERE play_id = ? AND status IN ('paid', 'booked')", (play_id,))
        if c.fetchone()['cnt'] > 0:
            return jsonify({"success": False, "message": "Không thể xóa suất diễn đã có người đặt vé"}), 400
            
        c.execute('DELETE FROM plays WHERE id = ?', (play_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Đã xóa suất diễn"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

