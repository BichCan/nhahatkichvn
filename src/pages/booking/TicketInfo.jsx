import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Ticket from "../../layouts/header/Ticket";

export default function TicketInfo() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/bookings', { credentials: 'include' });
        if (response.status === 401) {
          navigate('/login', { state: { message: "Vui lòng đăng nhập để xem lịch sử đặt vé" } });
          return;
        }
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (orderCode) => {
    // Currently, backend doesn't have a specific delete endpoint for a single booking, 
    // but we can implement it or just show an alert. 
    // For now, we'll keep it as a UI-only filter or suggest a backend update.
    alert("Chức năng hủy vé đang được bảo trì. Vui lòng liên hệ quầy vé.");
  };

  const handleDeleteAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả vé?")) {
      localStorage.removeItem("tickets");
      localStorage.removeItem("ticket");
      setTickets([]);
      navigate("/");
    }
  };

  // Nhóm vé theo suất diễn (ngày + giờ + tên vở)
  const groupedTickets = tickets.reduce((groups, ticket) => {
    const key = `${ticket.selectedDate || "—"} ${ticket.selectedTime || "—"} | ${ticket.performance?.name || "Vở diễn"}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(ticket);
    return groups;
  }, {});

  if (!tickets || tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
        <div className="max-w-lg w-full bg-white rounded-xl p-10 text-center shadow-lg">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-2xl font-bold mb-3 text-[#5a1a1a]">Chưa có vé nào</h2>
          <p className="text-sm text-gray-500 mb-7">
            Bạn chưa có vé nào được lưu. Hãy đặt vé để tham dự các buổi diễn tuyệt vời!
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-[#5a1a1a] text-white rounded-lg font-semibold hover:bg-[#7a2323] transition-colors"
            >
              Trang chủ
            </button>
            <button
              onClick={() => navigate("/dat-ve")}
              className="px-5 py-2.5 border border-[#5a1a1a] text-[#5a1a1a] rounded-lg font-semibold hover:bg-[#5a1a1a]/5 transition-colors"
            >
              Đặt vé ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#222]">🎟 Vé đã đặt</h1>
            <p className="text-sm text-gray-500 mt-1">
              Tổng cộng <span className="font-semibold text-[#5a1a1a]">{tickets.length} vé</span> được lưu
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#5a1a1a] text-white rounded-lg text-sm font-semibold hover:bg-[#7a2323] transition-colors print:hidden"
            >
              🖨 In tất cả
            </button>
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors print:hidden"
            >
              🗑 Xóa tất cả
            </button>
          </div>
        </div>

        {/* Vé nhóm theo suất diễn */}
        {Object.entries(groupedTickets).map(([groupKey, groupTickets]) => {
          const [dateTimeStr, performanceName] = groupKey.split(" | ");
          return (
            <div key={groupKey} className="mb-10">
              {/* Tiêu đề nhóm */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[#5a1a1a] rounded-full" />
                <div>
                  <div className="font-bold text-gray-800 text-base">{performanceName}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    📅 {dateTimeStr}
                    <span className="ml-2 bg-[#5a1a1a]/10 text-[#5a1a1a] text-xs px-2 py-0.5 rounded-full font-semibold">
                      {groupTickets.length} vé
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {groupTickets.map((t) => (
                  <Ticket
                    key={t.orderCode}
                    ticket={t}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div className="mt-6 bg-white rounded-xl p-4 flex items-center justify-between text-sm text-gray-500 shadow-sm print:hidden">
          <span>💾 Vé được lưu trong trình duyệt. Bạn có thể in hoặc chụp màn hình để lưu lại.</span>
          <button
            onClick={() => navigate("/dat-ve")}
            className="ml-4 text-[#5a1a1a] font-semibold hover:underline whitespace-nowrap"
          >
            + Đặt thêm vé
          </button>
        </div>
      </div>
    </div>
  );
}