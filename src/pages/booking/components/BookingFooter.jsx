import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingFooter({ 
    selectedSeats, 
    total, 
    performanceId, 
    selectedDate, 
    selectedTime,
    timeLeft,
    formatTimer,
    timerActive 
}) {
    const navigate = useNavigate();

    const handleContinue = () => {
      if(selectedDate&&selectedSeats&&selectedTime){
        navigate(`/thanh-toan/${performanceId}`, {
            state: {
                selectedSeats,
                selectedDate,
                selectedTime,
                holdExpiresAt: timerActive ? new Date(Date.now() + timeLeft * 1000).toISOString() : null
            }
        });
      }else{
        alert('Vui lòng chọn đủ thông tin về: Ngày, Giờ và Ghế');
      } 
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">
                        Tạm tính ({selectedSeats.length} ghế)
                    </span>
                    {timerActive && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-theater-red rounded-full border border-red-100 animate-pulse">
                            <span className="text-[10px] font-bold uppercase">Hết hạn trong:</span>
                            <span className="text-xs font-mono font-bold">{formatTimer(timeLeft)}</span>
                        </div>
                    )}
                </div>
                <span className="text-xl font-bold text-theater-red">
                    {total.toLocaleString()}đ
                </span>
            </div>
            <button 
                className={`px-10 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 ${
                    selectedSeats.length > 0 && selectedDate !== null && selectedTime !== null
                        ? 'bg-theater-red text-black shadow-red-200'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedSeats.length === 0 && selectedDate === null && selectedTime === null}
                onClick={handleContinue}
            >
                Tiếp tục
            </button>
        </footer>
    );
}