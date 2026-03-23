import React from 'react';

export default function CardDrama({ item, selectedSeats = [], selectedDate, selectedTime, total, onPayment }) {
    // Tạo mã đơn hàng
    const orderCode = `PLAY-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Tính đơn giá (lấy giá của ghế đầu tiên hoặc giá trung bình)
    const unitPrice = selectedSeats.length > 0 ? selectedSeats[0].price : 0;

    // Tính VAT 8%
    const vat = Math.round(total * 0.08);
    const grandTotal = total + vat;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Poster */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={item?.src}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 bg-[#c94a4a] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Suất diễn đặc biệt
                </span>
                <h2 className="absolute bottom-3 left-4 right-4 text-white text-xl font-bold leading-tight">
                    {item?.name}
                </h2>
            </div>

            {/* Info */}
            <div className="p-5">
                {/* Thời gian & Đơn giá */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Thời gian</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {selectedTime && selectedDate ? `${selectedTime}, ${selectedDate}` : 'Chưa chọn suất diễn'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Đơn giá</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {unitPrice.toLocaleString()}đ / vé
                        </p>
                    </div>
                </div>

                {/* Ghế đã chọn */}
                <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Ghế đã chọn</p>
                    <div className="flex flex-wrap gap-1.5">
                        {selectedSeats.map(seat => (
                            <span
                                key={seat.id}
                                className="px-2.5 py-1 border border-gray-300 rounded text-xs font-semibold text-gray-700 bg-gray-50"
                            >
                                {seat.id}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-300 my-4" />

                {/* Tổng cộng */}
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Tổng cộng</p>
                        <p className="text-2xl font-bold text-[#5a1a1a]">
                            {grandTotal.toLocaleString()}đ
                        </p>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Bao gồm VAT (8%)</p>
                </div>

                {/* Nút thanh toán */}
                <button
                    onClick={onPayment}
                    className="w-full py-3.5 bg-[#7a2323] hover:bg-[#5a1a1a] text-white font-bold rounded-xl transition-colors duration-200 uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md"
                >
                    Thanh toán ngay
                    <span>→</span>
                </button>

                {/* Mã đơn hàng */}
                <p className="text-center text-[10px] text-gray-400 mt-3">
                    Mã đơn hàng: {orderCode}
                </p>
            </div>
        </div>
    );
}
