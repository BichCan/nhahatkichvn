import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Thêm import Link
import playsData from "../../../data/PlaysData";

export default function PerformanceCard({ performance }) {
    // STATE - Theo dõi kích thước màn hình
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Kiểm tra nếu không có dữ liệu
    if (!performance) return null;

    // Lọc suất diễn theo ID vở diễn
    const playSchedules = playsData.filter(s => s.p_id === performance.id);

    // Xử lý ngày tháng
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lọc suất sắp chiếu
    const upcomingSchedules = playSchedules.filter(s => {
        const scheduleDate = new Date(s.date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate > today && (s.status === "còn chỗ" || s.status === "hết chỗ");
    });

    // Lọc suất chiếu hôm nay
    const todaySchedules = playSchedules.filter(s => {
        const scheduleDate = new Date(s.date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate.getTime() === today.getTime();
    });

    // Đếm số lượng theo trạng thái
    const availableCount = playSchedules.filter(s => s.status === "còn chỗ").length;
    const soldOutCount = playSchedules.filter(s => s.status === "hết chỗ").length;
    const closedCount = playSchedules.filter(s => s.status === "đã đóng").length;

    // Xác định trạng thái vở diễn
    const getStatus = () => {
        if (todaySchedules.length > 0) return "Đang diễn";
        if (upcomingSchedules.length > 0) return "Sắp diễn";
        return "Đã diễn";
    };

    // Lấy suất diễn đầu tiên để hiển thị (nếu có)
    const firstUpcoming = upcomingSchedules.length > 0 ? upcomingSchedules[0] : null;
    const firstToday = todaySchedules.length > 0 ? todaySchedules[0] : null;

    // Format ngày giờ hiển thị
    const formatShowDateTime = () => {
        if (firstToday) {
            const date = new Date(firstToday.date);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${firstToday.time}`;
        }
        if (firstUpcoming) {
            const date = new Date(firstUpcoming.date);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${firstUpcoming.time}`;
        }
        return null;
    };

    // Kiểm tra xem có thể đặt vé không
    const canBook = getStatus() !== 'Đã diễn' && availableCount > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            {/* Top Section: Image and Basic Info */}
            <div className="flex p-3 gap-3">
                {/* Image */}
                <div className="relative w-24 h-32 md:w-28 md:h-36 flex-shrink-0">
                    <img
                        src={performance.src || 'https://via.placeholder.com/400x600?text=No+Image'}
                        alt={performance.alt}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                        }}
                    />
                    <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatus() === 'Đang diễn' ? 'bg-green-500' :
                            getStatus() === 'Sắp diễn' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}>
                        {getStatus()}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div>
                        <h2 className="text-base md:text-lg font-bold leading-tight mb-1 line-clamp-2 text-gray-900">
                            {performance.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <span className="flex items-center gap-0.5 whitespace-nowrap">
                                {/* Icon thời gian - đã thay bằng icon schedule từ Material Symbols */}
                                <span className="material-symbols-outlined text-xs text-gray-400">schedule</span>
                                <span>{performance.duration}</span>
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0"></span>
                            <span className="truncate">{performance.type}</span>
                        </div>
                    </div>

                    {/* Thời gian công chiếu */}
                    {performance.startDate && performance.endDate && (
                        <div className="bg-purple-50 rounded-lg p-1.5 mt-1">
                            <div className="flex items-center gap-1.5 text-orange-500 font-semibold text-xs">
                                <span className="material-symbols-outlined text-xs">date_range</span>
                                <span className="truncate">
                                    {performance.startDate} - {performance.endDate}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Section: Statistics Row */}
            <div className="px-4 py-2 border-t border-gray-100 grid grid-cols-4 gap-1 text-center">
                <div className="flex flex-col">
                    <span className="text-[8px] uppercase text-gray-400 font-bold">TỔNG SUẤT</span>
                    <span className="text-sm font-bold text-gray-900">{performance.numofplays}</span>
                </div>
                <div className="flex flex-col border-l border-gray-100">
                    <span className="text-[8px] uppercase text-emerald-500 font-bold">CÒN VÉ</span>
                    <span className="text-sm font-bold text-emerald-600">{availableCount}</span>
                </div>
                <div className="flex flex-col border-l border-gray-100">
                    <span className="text-[8px] uppercase text-rose-500 font-bold">HẾT VÉ</span>
                    <span className="text-sm font-bold text-rose-600">{soldOutCount}</span>
                </div>
                <div className="flex flex-col border-l border-gray-100">
                    <span className="text-[8px] uppercase text-gray-400 font-bold">ĐÃ ĐÓNG</span>
                    <span className="text-sm font-bold text-gray-900">{closedCount}</span>
                </div>
            </div>

            {/* Today's Schedules */}
            {todaySchedules.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                    <h4 className="text-xs font-semibold mb-1.5 text-red-600 flex items-center gap-1">
                        <span>🔴</span> Hôm nay
                    </h4>
                    <div className="space-y-1">
                        {todaySchedules.slice(0, 1).map(schedule => (
                            <div key={schedule.id} className="flex items-center justify-between bg-red-50 p-1.5 rounded-lg text-xs">
                                <span className="font-medium text-gray-700">{schedule.time}</span>
                                <span className="text-gray-600">
                                    {schedule.available_seats > 0 ? `${schedule.available_seats} chỗ` : 'Hết'}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${schedule.status === 'còn chỗ' ? 'bg-green-100 text-green-700' :
                                        schedule.status === 'hết chỗ' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {schedule.status === 'còn chỗ' ? 'Còn' : schedule.status === 'hết chỗ' ? 'Hết' : 'Đóng'}
                                </span>
                            </div>
                        ))}
                        {todaySchedules.length > 1 && (
                            <p className="text-[10px] text-gray-500 text-center">
                                +{todaySchedules.length - 1} suất khác
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Upcoming Schedules */}
            {upcomingSchedules.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                    <h4 className="text-xs font-semibold mb-1.5 text-blue-600 flex items-center gap-1">
                        <span>📅</span> Sắp tới
                    </h4>
                    <div className="space-y-1">
                        {upcomingSchedules.slice(0, 1).map(schedule => (
                            <div key={schedule.id} className="flex items-center justify-between bg-gray-50 p-1.5 rounded-lg text-xs">
                                <span className="text-gray-600">
                                    {new Date(schedule.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                </span>
                                <span className="font-medium text-gray-700">{schedule.time}</span>
                                <span className="text-gray-600">
                                    {schedule.available_seats > 0 ? `${schedule.available_seats} chỗ` : 'Hết'}
                                </span>
                            </div>
                        ))}
                        {upcomingSchedules.length > 1 && (
                            <p className="text-[10px] text-gray-500 text-center">
                                +{upcomingSchedules.length - 1} suất khác
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Action Button Section */}
            <div className="mt-auto p-3 bg-gray-50 border-t border-gray-100">
                {canBook ? (
                    <Link
                        to={`/dat-ve/${performance.id}`}
                        className="w-full font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        <span className="material-symbols-outlined text-base">confirmation_number</span>
                        <span>Đặt vé ngay</span>
                    </Link>
                ) : (
                    <button
                        className="w-full font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                        disabled
                    >
                        <span className="material-symbols-outlined text-base">confirmation_number</span>
                        <span>
                            {getStatus() === 'Đã diễn' ? 'Đã kết thúc' : 'Hết vé'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}