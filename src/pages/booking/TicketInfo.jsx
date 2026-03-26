import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Ticket from "../../layouts/header/Ticket";

export default function TicketInfo() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    try {
      // ưu tiên 'tickets' (mảng). nếu chỉ có 'ticket' cũ thì chuyển thành mảng để tương thích
      const rawMulti = localStorage.getItem("tickets");
      if (rawMulti) {
        setTickets(JSON.parse(rawMulti));
        return;
      }
      const rawSingle = localStorage.getItem("ticket");
      if (rawSingle) {
        const single = JSON.parse(rawSingle);
        setTickets(Array.isArray(single) ? single : [single]);
        return;
      }
      setTickets([]);
    } catch (e) {
      setTickets([]);
    }
  }, []);

  const saveTickets = (next) => {
    setTickets(next);
    localStorage.setItem("tickets", JSON.stringify(next));
    // keep legacy single 'ticket' in sync with last saved (optional)
    if (next.length > 0) localStorage.setItem("ticket", JSON.stringify(next[next.length - 1]));
    else localStorage.removeItem("ticket");
  };

  const handleDelete = (orderCode) => {
    const next = tickets.filter(t => (t.orderCode || t.orderCode === orderCode ? t.orderCode !== orderCode : true));
    // fallback compare by generated code if ticket.orderCode absent
    const filtered = next.length === tickets.length
      ? tickets.filter((t, i) => {
          const code = t.orderCode || `NTK-${t.performance?.id || "00"}-${(t.createdAt || 0).toString().slice(-6)}`;
          return code !== orderCode;
        })
      : next;
    saveTickets(filtered);
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
        <div className="max-w-lg w-full bg-white rounded-xl p-8 text-center shadow">
          <h2 className="text-2xl font-bold mb-4">Không có vé</h2>
          <p className="text-sm text-gray-600 mb-6">Bạn chưa có vé nào được lưu. Vui lòng hoàn tất đặt vé trước.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate("/")} className="px-4 py-2 bg-[#5a1a1a] text-white rounded">Trang chủ</button>
            <button onClick={() => navigate("/vo-dien")} className="px-4 py-2 border rounded">Xem vở diễn</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-6 text-[#222]">Thông tin đặt vé</h1>

        <div className="space-y-6">
          {tickets.map((t, idx) => (
            <div key={t.orderCode || idx}>
              <Ticket ticket={t} onDelete={(code) => handleDelete(code)} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Vé được lưu trong trình duyệt. Bạn có thể in hoặc lưu lại.</div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="px-4 py-2 bg-[#5a1a1a] text-white rounded">In tất cả</button>
            <button onClick={() => { localStorage.removeItem("tickets"); localStorage.removeItem("ticket"); setTickets([]); navigate("/"); }} className="px-4 py-2 border rounded">Xóa tất cả</button>
          </div>
        </div>
      </div>
    </div>
  );
}