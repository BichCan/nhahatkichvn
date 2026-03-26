import React from "react";

export default function Ticket({ ticket = {}, onDelete }) {
  const { performance = {}, selectedSeats = [], selectedDate, selectedTime, total, orderCode } = ticket;
  const seatList = selectedSeats.map(s => s.id || s).join(", ");
  const firstSeat = selectedSeats[0]?.id || seatList.split(",")[0] || "";
  const formatVnd = (v) => (Number(v) || 0).toLocaleString("vi-VN") + "đ";
  const code = orderCode || `NTK-${performance?.id || "00"}-${Date.now().toString().slice(-6)}`;

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row bg-white">
      <div className="md:w-1/3 bg-black flex items-stretch">
        <img
          src={
            performance?.src ||
            performance?.image ||
            performance?.poster ||
            performance?.thumbnail ||
            performance?.cover ||
            performance?.posterUrl ||
            performance?.img ||
            performance?.thumb ||
            "/placeholder-poster.jpg"
          }
          alt={performance?.name}
          className="object-cover w-full h-56 md:h-full"
        />
      </div>

      <div className="md:w-1/2 bg-yellow-400 text-black px-6 py-6 md:py-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-black/70">Sân khấu chính</div>
            <h2 className="text-2xl font-extrabold tracking-tight">{performance?.name || "—"}</h2>
            <div className="mt-4 text-sm text-black/80 space-y-1">
              <div><span className="font-semibold">Thời gian:</span> {selectedDate || "—"} • {selectedTime || "—"}</div>
              <div><span className="font-semibold">Vị trí chỗ ngồi:</span> <span className="text-2xl font-bold">{firstSeat}</span></div>
              <div><span className="font-semibold">Ghế:</span> {seatList || "—"}</div>
              <div><span className="font-semibold">Tổng:</span> <span className="text-lg font-bold">{formatVnd(total)}</span></div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-black/70">Mã vé</div>
            <div className="mt-2 inline-block bg-black text-yellow-400 px-3 py-1 rounded font-mono font-bold">{code}</div>
            <div className="mt-6 text-sm text-black/80">Vui lòng mang mã này khi đến rạp</div>
          </div>
        </div>
      </div>

      <div className="md:w-1/6 bg-yellow-500 flex items-center justify-center p-3">
        <div className="w-full h-full flex flex-col items-center justify-center text-black">
          <div className="transform rotate-90 md:rotate-0 text-xs font-bold tracking-wider">Barcode Ticket</div>
          <div className="mt-4 w-20 h-16 bg-black" />
          <div className="mt-3 text-[10px]">NTK • 2024</div>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => window.print()}
          className="px-3 py-1 bg-[#5a1a1a] text-white rounded text-sm"
        >
          In
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(code)}
            className="px-3 py-1 border rounded text-sm"
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
}