import React from "react";
import performancesdata from "../../data/PerformancesData";


export default function Ticket({ ticket = {}, onDelete }) {
  const {
    performance = {},
    seat,          // 1 ghế duy nhất (object {id, row, number, type, price})
    selectedDate,
    selectedTime,
    orderCode,
    createdAt
  } = ticket;

  const formatVnd = (v) => (Number(v) || 0).toLocaleString("vi-VN") + "đ";

  // Hiển thị thông tin ghế
  const seatLabel = seat
    ? `${seat.row}${seat.number} (${seat.type || "Ghế thường"})`
    : ticket.seatLabel || "—";

  const seatPrice = seat?.price || ticket.price || 0;

  // Mã vé cố định (lưu sẵn từ khi tạo)
  const code = orderCode || `NTK-${performance?.id || "00"}-${String(createdAt || Date.now()).slice(-6)}`;

  // Get poster from mock data
  const mockPerformance = performancesdata.find(p => p.id === performance?.id);
  const posterImgSrc = mockPerformance?.src || performance?.src || performance?.image || performance?.posterUrl || "/placeholder-poster.jpg";

  // Format ngày
  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row bg-white print:shadow-none">
      {/* Ảnh poster */}
      <div className="md:w-[220px] flex-shrink-0 bg-black flex items-stretch">
        <img
          src={posterImgSrc}
          alt={performance?.name}
          className="object-cover w-full h-52 md:h-full"
        />
      </div>

      {/* Thông tin chính */}
      <div className="flex-1 bg-yellow-400 text-black px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase font-semibold text-black/60 mb-1">Sân khấu chính · Nhà Hát Kịch Việt Nam</div>
            <h2 className="text-xl font-extrabold tracking-tight leading-tight truncate">{performance?.name || "—"}</h2>

            <div className="mt-4 space-y-1.5 text-sm text-black/80">
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24 shrink-0">📅 Ngày:</span>
                <span>{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24 shrink-0">⏰ Giờ:</span>
                <span>{selectedTime || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24 shrink-0">🪑 Ghế:</span>
                <span className="text-lg font-bold">{seatLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24 shrink-0">💰 Giá:</span>
                <span className="text-base font-bold">{formatVnd(seatPrice)}</span>
              </div>
            </div>
          </div>

          {/* Mã vé */}
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] text-black/60 uppercase mb-1">Mã vé</div>
            <div className="inline-block bg-black text-yellow-400 px-3 py-1 rounded font-mono font-bold text-sm">{code}</div>
            <div className="mt-3 text-xs text-black/70 max-w-[120px] text-right">Mang mã này khi đến rạp</div>
          </div>
        </div>
      </div>

      {/* Barcode stub */}
      <div className="md:w-20 bg-yellow-500 flex items-center justify-center p-3 flex-shrink-0">
        <div className="flex flex-col items-center justify-center text-black gap-2">
          <div className="transform md:-rotate-90 text-[9px] font-bold tracking-widest whitespace-nowrap">TICKET</div>
          <div className="w-10 h-20 bg-black rounded-sm opacity-80" />
          <div className="text-[9px]">NTK·2026</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute top-3 right-24 flex gap-2 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-3 py-1 bg-[#5a1a1a] text-white rounded text-xs font-semibold hover:bg-[#7a2323]"
        >
          🖨 In
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(code)}
            className="px-3 py-1 border border-gray-400 rounded text-xs font-semibold hover:bg-gray-100 bg-white"
          >
            🗑 Xóa
          </button>
        )}
      </div>
    </div>
  );
}