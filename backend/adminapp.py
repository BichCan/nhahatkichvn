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

def verify_admin_status(request_data=None):
    """
    Helper to verify admin status from session or validated fallback.
    Returns (admin_id, error_response)
    """
    # 1. Try session first
    if 'user_id' in session and session.get('user_role') == 'admin':
        return session.get('user_id'), None
        
    # 2. Try fallback from request body/params if provided
    admin_id = request_data.get('admin_id') if request_data else None
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
