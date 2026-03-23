import React from 'react';

export default function SeatLegend() {
    return (
        <div className="mb-4 flex pl-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#b3b3b3]"></div>
                <span>Ghế thường</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#3b5998]"></div>
                <span>Ghế VIP</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500"></div>
                <span>Đang chọn</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500"></div>
                <span>Đang giữ</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500"></div>
                <span>Đã chọn</span>
            </div>
        </div>
    );
}