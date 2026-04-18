import re

def patch_backend():
    with open('backend/app.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace Redis definition
    content = re.sub(
        r"# Redis connection for seat holding[\s\S]+?decode_responses=True\n\)",
        "import threading\nimport time\nimport uuid\n\n# Background thread for expiry\ndef run_background_cleanup():\n    while True:\n        time.sleep(60)\n        try:\n            import requests\n            requests.post('http://127.0.0.1:5000/api/internal/cleanup')\n        except:\n            pass",
        content
    )

    # Note: we need to actually start the thread. It is safer to do it near `if __name__ == '__main__':`
    content = content.replace(
        "if __name__ == '__main__':",
        "if __name__ == '__main__':\n    threading.Thread(target=run_background_cleanup, daemon=True).start()"
    )

    # 2. Replace the massive section from `broadcast_seat_update` to END of `confirm_booking` and `get_seat_status`
    # We will use regex to find the start and end precisely.
    start_str = "def broadcast_seat_update(session_id):"
    end_str = "@app.route('/api/login', methods=['POST'])"
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find boundaries")
        return

    new_block = """
@app.route('/api/internal/cleanup', methods=['POST'])
def internal_cleanup():
    cleanup_expired_holds()
    return jsonify({"success": True})

def cleanup_expired_holds():
    \"\"\"System job to cancel expired holding bookings and revert tickets\"\"\"
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
    \"\"\"Gửi trạng thái ghế mới nhất\"\"\"
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
    
    if not all([performance_id, date, time_str, seat_id, user_id]):
        return jsonify({"success": False, "message": "Thiếu thông tin bắt buộc"}), 400
        
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
            INSERT INTO bookings (user_id, performance_id, seat_id, seat_row, seat_number, show_date, show_time, price, payment_method, order_code, status, hold_start_time, hold_expiry_time, session_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'holding', ?, ?, ?)
        ''', (user_id, performance_id, seat_id, seat_id[0], seat_id[1:], date, time_str, 0, 'Hold', '', now_str, expiry_str, session_uid))
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

"""
    
    content = content[:start_idx] + new_block + content[end_idx:]

    # Now, fix /api/bookings POST (handle_bookings chunk)
    # We will search for logic inside `if request.method == 'POST':` inside `handle_bookings`
    start_bookings_idx = content.find("if request.method == 'POST':")
    end_bookings_idx = content.find("else: # GET")
    
    if start_bookings_idx != -1 and end_bookings_idx != -1:
        new_bookings_block = """if request.method == 'POST':
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
            
    """
        content = content[:start_bookings_idx] + new_bookings_block + content[end_bookings_idx:]

    with open('backend/app.py', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    patch_backend()
