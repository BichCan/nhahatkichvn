import sqlite3
import json

def investigate():
    conn = sqlite3.connect('../nhahatkichvn.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    IDs = ['6B3D83A2', 'B2C0E7F4', '4956B3E8', '6FF89E06', '03007107', '001', '002']
    results = {}
    
    for id_part in IDs:
        results[id_part] = {"tickets": [], "bookings": [], "order": None}
        
        # Find the full order_id first
        c.execute("SELECT * FROM orders WHERE order_id LIKE ?", ('%' + id_part,))
        order_rows = c.fetchall()
        if order_rows:
            results[id_part]["orders_found"] = [dict(r) for r in order_rows]
            full_ids = [r['order_id'] for r in order_rows]
            
            for full_id in full_ids:
                # Check tickets
                c.execute("SELECT * FROM tickets WHERE order_id = ?", (full_id,))
                results[id_part]["tickets"].extend([dict(r) for r in c.fetchall()])
                
                # Check bookings
                c.execute("SELECT * FROM bookings WHERE order_id = ? OR converted_to_order_id = ?", (full_id, full_id))
                results[id_part]["bookings"].extend([dict(r) for r in c.fetchall()])
                
                # Check order_details
                c.execute("SELECT * FROM order_details WHERE order_id = ?", (full_id,))
                results[id_part]["order_details"] = results[id_part].get("order_details", []) + [dict(r) for r in c.fetchall()]
    
    with open('investigate_output.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    conn.close()

if __name__ == "__main__":
    investigate()
