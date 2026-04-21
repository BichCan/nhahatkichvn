import React, { useState, useEffect } from 'react';
import PerformanceCard from './components/Performance';

export default function Performances() {
    const [classifiedPlays, setClassifiedPlays] = useState({
        ongoing: [],
        upcoming: []
    });
    const [allPlaySchedules, setAllPlaySchedules] = useState([]);
    
    useEffect(() => {
        Promise.all([
            fetch('http://127.0.0.1:5000/api/performances').then(r => r.json()),
            fetch('http://127.0.0.1:5000/api/plays').then(r => r.json())
        ])
        .then(([perfData, playSchedulesList]) => {
            setAllPlaySchedules(playSchedulesList);
            // Phân loại vở diễn
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const ongoing = [];
            const upcoming = [];
            
            perfData.forEach(performance => {
                const playSchedules = playSchedulesList.filter(s => s.p_id === performance.id);
                    
                    const todaySchedules = playSchedules.filter(s => {
                        const scheduleDate = new Date(s.date);
                        scheduleDate.setHours(0, 0, 0, 0);
                        return scheduleDate.getTime() === today.getTime()
                            && (s.status === "còn chỗ" || s.status === "hết chỗ");
                    });
                    
                    const upcomingSchedules = playSchedules.filter(s => {
                        const scheduleDate = new Date(s.date);
                        scheduleDate.setHours(0, 0, 0, 0);
                        return scheduleDate > today
                            && (s.status === "còn chỗ" || s.status === "hết chỗ");
                    });
                    
                    if (todaySchedules.length > 0) {
                        ongoing.push(performance);
                    } else if (upcomingSchedules.length > 0) {
                        upcoming.push(performance);
                    } else if (performance.status === 'active') {
                        // Nếu performance đang active nhưng chưa có lịch cụ thể -> xếp vào sắp diễn
                        upcoming.push(performance);
                    }
                });

                
                setClassifiedPlays({ ongoing, upcoming });
            })
            .catch(err => console.error("Error fetching performances:", err));
    }, []);
    
    // Component section với Tailwind
    const Section = ({ title, icon, colorClass, plays, emptyMessage }) => {
        if (plays.length === 0) return null;
        
        // Màu sắc cho từng section
        const getColorClasses = () => {
            switch(colorClass) {
                case 'green':
                    return {
                        line: 'bg-green-500',
                        badge: 'bg-green-100 text-green-700',
                        emptyBg: 'bg-green-50'
                    };
                case 'orange':
                    return {
                        line: 'bg-orange-500',
                        badge: 'bg-orange-100 text-orange-700',
                        emptyBg: 'bg-orange-50'
                    };
                default:
                    return {
                        line: 'bg-gray-500',
                        badge: 'bg-gray-100 text-gray-700',
                        emptyBg: 'bg-gray-50'
                    };
            }
        };
        
        const colors = getColorClasses();
        
        return (
            <div className="mb-10 md:mb-12">
                {/* Header với icon và màu sắc */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-1.5 h-8 ${colors.line} rounded-full`}></div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xl">{icon}</span>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            {title}
                        </h2>
                        <span className={`text-sm px-2.5 py-1 rounded-full ${colors.badge} font-medium`}>
                            {plays.length} vở
                        </span>
                    </div>
                </div>
                
                {/* Grid cards */}
                {plays.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {plays.map((performance) => (
                            <PerformanceCard 
                                key={performance.id} 
                                performance={performance}
                                playSchedules={allPlaySchedules}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-10 ${colors.emptyBg} rounded-lg border border-gray-200`}>
                        <p className="text-gray-500">{emptyMessage}</p>
                    </div>
                )}
                
                {/* Divider giữa các section */}
                {title === "ĐANG DIỄN" && plays.length > 0 && (
                    <div className="mt-8 mb-2 border-b border-gray-200"></div>
                )}
            </div>
        );
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {/* Header chính */}
            <div className="mb-8 md:mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    VỞ DIỄN
                </h1>
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="w-10 h-0.5 bg-orange-500 rounded-full"></span>
                    <p className="text-sm md:text-base">
                        {classifiedPlays.ongoing.length + classifiedPlays.upcoming.length} vở diễn đang và sắp công diễn
                    </p>
                </div>
            </div>
            
            {/* Đang diễn - Trên cùng */}
            <Section 
                title="ĐANG DIỄN"
                colorClass="green"
                plays={classifiedPlays.ongoing}
                emptyMessage="Hiện không có vở diễn nào đang công diễn"
            />
            
            {/* Sắp diễn - Ở giữa */}
            <Section 
                title="SẮP DIỄN"
                colorClass="orange"
                plays={classifiedPlays.upcoming}
                emptyMessage="Hiện không có vở diễn nào sắp công diễn"
            />
            
            {/* Thống kê tổng quan */}
            <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-center">
                    <div>
                        <div className="text-2xl font-bold text-green-600">{classifiedPlays.ongoing.length}</div>
                        <div className="text-xs text-gray-500">Đang diễn</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-orange-600">{classifiedPlays.upcoming.length}</div>
                        <div className="text-xs text-gray-500">Sắp diễn</div>
                    </div>
                </div>
            </div>
        </div>
    );
}