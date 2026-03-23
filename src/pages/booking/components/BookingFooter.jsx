import React from 'react';

export default function BookingFooter({ selectedSeats, total }) {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
            <div className="flex flex-col">
                <span className="text-xs text-slate-500">
                    Tạm tính ({selectedSeats.length} ghế)
                </span>
                <span className="text-xl font-bold text-theater-red">
                    {total.toLocaleString()}đ
                </span>
            </div>
            <button 
                className={`px-10 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 ${
                    selectedSeats.length > 0
                        ? 'bg-theater-red text-white shadow-red-200'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedSeats.length === 0}
            >
                Tiếp tục
            </button>
        </footer>
    );
}