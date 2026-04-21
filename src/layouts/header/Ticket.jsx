import React from "react";

/**
 * Premium Ticket Component
 * Redesigned for a high-end theater experience.
 */
export default function Ticket({ ticket = {}, onDelete }) {
  const {
    performance = {},
    seat,
    selectedDate,
    selectedTime,
    orderCode,
    price,
    status,
    adminConfirmed
  } = ticket;

  const formatVnd = (v) => (Number(v) || 0).toLocaleString("vi-VN") + "đ";

  const seatLabel = seat
    ? `${seat.row}${seat.number}`
    : "—";

  const code = orderCode || "N/A";
  
  const posterImgSrc = performance?.poster_url || "/placeholder-poster.jpg";

  // Status mapping
  const isPaid = status === 'paid' || adminConfirmed;
  const isCancelled = status === 'cancelled';

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col sm:flex-row border border-gray-100 group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Visual Side */}
      <div className="sm:w-48 h-40 sm:h-auto relative overflow-hidden shrink-0">
        <img
          src={posterImgSrc}
          alt={performance?.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent sm:hidden" />
      </div>

      {/* Info Side */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5a1a1a]/60 mb-1">
                Nhà Hát Kịch Việt Nam
              </p>
              <h3 className="text-xl font-black text-gray-800 leading-tight">
                {performance?.name || "Vở diễn"}
              </h3>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest 
                ${isPaid ? "bg-green-100 text-green-700" : 
                  isCancelled ? "bg-red-100 text-red-700" : 
                  "bg-amber-100 text-amber-700"}`}>
                {isPaid ? "Đã xác nhận" : isCancelled ? "Đã hủy" : "Đang xử lý"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Thời gian</p>
              <p className="font-bold text-gray-700">{selectedDate} | {selectedTime}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Vị trí ghế</p>
              <p className="font-bold text-gray-700 text-lg">{seatLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-dashed border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Mã đơn hàng</p>
            <p className="font-mono font-bold text-[#5a1a1a]">{code}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Giá vé</p>
             <p className="text-xl font-black text-gray-900">{formatVnd(price)}</p>
          </div>
        </div>
      </div>

      {/* Decorative Stub */}
      <div className="hidden sm:flex w-12 bg-gray-50 border-l border-dashed border-gray-200 items-center justify-center">
        <div className="transform -rotate-90 whitespace-nowrap text-[10px] font-black tracking-[0.4em] text-gray-300">
          THEATER TICKET
        </div>
      </div>
    </div>
  );
}