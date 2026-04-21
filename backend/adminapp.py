from flask import Blueprint, jsonify, request, session
from db_utils import get_db_connection

admin_bp = Blueprint('admin', __name__)

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

# News Management Routes
@admin_bp.route('/news', methods=['POST'])
def create_news():
    # Basic session-based admin check
    if 'user_role' in session and session['user_role'] != 'admin':
         return jsonify({"success": False, "message": "Bạn không có quyền thực hiện hành động này"}), 403
    
    data = request.json
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')
    
    if not title or not content:
        return jsonify({"success": False, "message": "Vui lòng nhập đầy đủ tiêu đề và nội dung"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            INSERT INTO news (title, content, image_url, created_at, is_published)
            VALUES (?, ?, ?, datetime('now'), 1)
        ''', (title, content, image_url))
        conn.commit()
        return jsonify({"success": True, "message": "Thêm tin tức thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

# Artist Management Routes
@admin_bp.route('/artists', methods=['POST'])
def create_artist():
    # Basic session-based admin check
    if 'user_role' in session and session['user_role'] != 'admin':
         return jsonify({"success": False, "message": "Bạn không có quyền thực hiện hành động này"}), 403
    
    data = request.json
    name = data.get('name')
    bio = data.get('bio')
    role_type = data.get('role_type')
    avatar_url = data.get('avatar_url')
    
    if not name:
        return jsonify({"success": False, "message": "Vui lòng nhập tên nghệ sĩ"}), 400
        
    conn = get_db_connection()
    try:
        c = conn.cursor()
        c.execute('''
            INSERT INTO artists (name, bio, role_type, avatar_url)
            VALUES (?, ?, ?, ?)
        ''', (name, bio, role_type, avatar_url))
        conn.commit()
        return jsonify({"success": True, "message": "Thêm nghệ sĩ thành công!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()
