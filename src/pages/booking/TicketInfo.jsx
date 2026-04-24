import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TicketTabs from "./components/TicketTabs";

// Helper function to format currency
const formatVnd = (v) => (Number(v) || 0).toLocaleString("vi-VN") + "đ";

// Helper function for countdown timer
const calculateTimeLeft = (expiryTime) => {
  const difference = +new Date(expiryTime) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function TicketInfo() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/tickets", {
        credentials: "include",
      });
      if (response.status === 401) {
        navigate("/login", {
          state: { message: "Vui lòng đăng nhập để xem lịch sử đặt vé" },
        });
        return;
      }
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchTickets();
      } else {
        alert(result.message || "Hủy đơn hàng thất bại");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("Không thể kết nối đến máy chủ");
    }
  };

  // Filter tickets based on active tab
  const filteredTickets = tickets.filter((t) => {
    const isExpired = t.status === "holding" && t.holdExpiredAt && new Date(t.holdExpiredAt) < new Date();
    const isPaid = t.paymentStatus === "paid" || t.adminConfirmed || t.status === "paid";
    const isCancelled = t.paymentStatus === "cancelled" || t.status === "available" || isExpired;
    const isPending = (t.paymentStatus === "pending" || t.status === "booked" || t.status === "holding") && !isPaid && !isCancelled;

    if (activeTab === "all") return true;
    if (activeTab === "pending") return isPending;
    if (activeTab === "success") return isPaid;
    if (activeTab === "cancelled") return isCancelled;
    return true;
  });

  // Group filtered tickets by orderCode
  const orderGroups = filteredTickets.reduce((groups, ticket) => {
    // For uncompleted held tickets, use a unique key per ticket to show them separately
    // Or group all "NO_ORDER" together. The user specified "Ngược chiều bình an"
    // which was a single ticket attempt.
    const key = ticket.orderCode || `UNCOMPLETED-${ticket.id}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(ticket);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a1a1a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf9] pb-20">
      {/* Header / Hero */}
      <div className="bg-[#5a1a1a] text-white py-16 px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              VÉ CỦA TÔI
            </h1>
            <p className="text-white/70 max-w-xl text-lg">
              Quản lý các suất diễn bạn đã đặt, kiểm tra trạng thái thanh toán và
              xem lại lịch sử giao dịch tại Nhà Hát Kịch Việt Nam.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Tabs */}
        <TicketTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {tickets.length === 0 ? (
          <EmptyState navigate={navigate} />
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-500">
              Không tìm thấy vé trong danh mục này
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(orderGroups).map(([orderCode, items]) => (
                <OrderCard
                  key={orderCode}
                  orderCode={orderCode}
                  items={items}
                  onCancel={handleCancelOrder}
                />
              ))}
            </div>

            {/* Sidebar / Instructions for Pending Tab */}
            <div className="lg:col-span-1 space-y-6">
              {activeTab === "pending" || activeTab === "all" ? (
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Hướng dẫn thanh toán
                  </h3>
                  <div className="space-y-4">
                     <PaymentStep 
                        number="1" 
                        text="Đến quầy vé tại Nhà Hát Kịch Việt Nam (Số 1 Tràng Tiền)." 
                     />
                     <PaymentStep 
                        number="2" 
                        text="Cung cấp Mã Đơn Hàng cho nhân viên soát vé." 
                     />
                     <PaymentStep 
                        number="3" 
                        text="Thanh toán bằng tiền mặt hoặc chuyển khoản tại chỗ." 
                     />
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-500 italic">
                      * Lưu ý: Các đơn hàng chưa thanh toán sẽ tự động bị hủy sau 24 giờ kể từ khi đặt.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#5a1a1a] p-8 rounded-3xl text-white shadow-xl shadow-[#5a1a1a]/20 sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Trải nghiệm tuyệt vời</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Hãy chuẩn bị sẵn mã vé điện tử khi đến rạp để việc soát vé diễn ra nhanh chóng nhất.
                  </p>
                  <button 
                    onClick={() => navigate("/dat-ve")}
                    className="w-full py-4 bg-white text-[#5a1a1a] rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    + Đặt Đêm Diễn Mới
                  </button>
                </div>
              )}
            </div>
            </div>
          
        ) }
      </div>
    </div>
  );
}

function OrderCard({ orderCode, items, onCancel }) {
  const firstItem = items[0] || {};
  const isExpired = firstItem.status === "holding" && firstItem.holdExpiredAt && new Date(firstItem.holdExpiredAt) < new Date();
  const isSuccess = firstItem.paymentStatus === "paid" || firstItem.adminConfirmed || firstItem.status === "paid";
  const isCancelled = firstItem.paymentStatus === "cancelled" || firstItem.status === "available" || isExpired;
  const isPending = (firstItem.paymentStatus === "pending" || firstItem.status === "booked" || firstItem.status === "holding") && !isSuccess && !isCancelled;

  const [timeLeft, setTimeLeft] = useState(
    firstItem.holdExpiredAt ? calculateTimeLeft(firstItem.holdExpiredAt) : {}
  );

  useEffect(() => {
    if (!firstItem.holdExpiredAt || !isPending) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(firstItem.holdExpiredAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [firstItem.holdExpiredAt, isPending]);

  if (!items || items.length === 0) return null;

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0) * 1.08;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Poster */}
        <div className="h-48 md:h-full relative group">
          <img
            src={firstItem.performance?.poster_url || "/placeholder-poster.jpg"}
            alt={firstItem.performance?.name || "Vở diễn"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight 
               ${isPending ? "bg-amber-400 text-black" : 
                 isSuccess ? "bg-green-500 text-white" : 
                 "bg-gray-500 text-white"}`}>
               {isPending ? "Chờ xử lý" : isSuccess ? "Thành công" : "Đã hủy"}
             </span>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-3 p-6 md:p-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mã đơn hàng</div>
              <div className="text-xl font-mono font-bold text-[#5a1a1a]">{orderCode}</div>
            </div>
            {isPending && firstItem.status === "holding" && timeLeft.seconds !== undefined && (
              <div className="text-right">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Hết hạn trong</div>
                <div className="text-xl font-mono font-black text-amber-600">
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-2 truncate">
                {firstItem.performance?.name || "Tên vở diễn"}
              </h4>
              <p className="text-xs font-mono text-gray-400 mb-2">
                {orderCode.startsWith('UNCOMPLETED') ? "Giữ chỗ chưa hoàn tất" : `Mã: ${orderCode}`}
              </p>
              <div className="space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  Ngày diễn: {firstItem.selectedDate} | {firstItem.selectedTime}
                </div>
                <div className="flex items-center gap-2">
                  Vị trí ghế: <span className="font-bold text-gray-700">
                    {items.map(i => `${i.seat.row}${i.seat.number}`).join(", ")}
                  </span>
                </div>
              </div>
            </div>
            <div className="sm:text-right flex flex-col justify-end">
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Tổng cộng (có VAT)</div>
                <div className="text-2xl font-black text-gray-900">{formatVnd(totalPrice)}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
            {isPending ? (
              <>
                <button 
                  onClick={() => onCancel(orderCode)}
                  className="flex-1 py-3 px-6 border-2 border-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all text-sm"
                >
                  Hủy đơn hàng
                </button>
                <button className="flex-1 py-3 px-6 bg-[#5a1a1a] text-white rounded-xl font-bold hover:bg-[#7a2323] transition-all text-sm shadow-lg shadow-[#5a1a1a]/20">
                  Thanh toán ngay
                </button>
              </>
            ) : isSuccess && (
              <button 
                onClick={() => window.print()}
                className="w-full py-3 px-6 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                In hóa đơn / Lưu vé
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({ number, text }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-[#5a1a1a]/10 text-[#5a1a1a] flex items-center justify-center shrink-0 font-bold text-sm">
        {number}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed pt-1">
        {text}
      </p>
    </div>
  );
}

function EmptyState({ navigate }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center py-20">
      <div className="max-w-lg w-full bg-white rounded-[40px] p-12 text-center shadow-2xl shadow-gray-200/50">
        <h2 className="text-3xl font-black mb-4 text-[#5a1a1a]">Chưa tìm thấy vé</h2>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          Có vẻ như bạn chưa có đơn hàng nào được tạo. Hãy bắt đầu chọn những đêm diễn tuyệt vời nhất!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Trang chủ
          </button>
          <button
            onClick={() => navigate("/dat-ve")}
            className="px-8 py-4 bg-[#5a1a1a] text-white rounded-2xl font-bold hover:bg-[#7a2323] transition-all shadow-xl shadow-[#5a1a1a]/30"
          >
            Đặt vé ngay
          </button>
        </div>
      </div>
    </div>
  );
}