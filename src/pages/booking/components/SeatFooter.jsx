import React from 'react';

export default function SeatFooter({ totalSeats, regularSeats, vipSeats, selectedSeats, totalAmount }) {
    return (
        <footer className="w-full flex flex-col items-center mt-auto max-w-md pb-4">
            <div className="text-gray-700 font-bold text-center">
                <div className="text-lg">Tổng số ghế: {totalSeats}</div>
                <div className="text-sm font-normal text-gray-600 mt-1">
                    Ghế thường: {regularSeats} | Ghế VIP: {vipSeats}
                </div>
                {selectedSeats > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="text-md text-[#8B0000]">
                            Đã chọn: {selectedSeats} ghế
                        </div>
                        <div className="text-xl font-bold text-[#8B0000] mt-1">
                            {totalAmount.toLocaleString()}đ
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
}