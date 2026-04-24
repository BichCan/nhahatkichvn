import React from 'react';
import { FaEye, FaRegCalendarAlt, FaUsers } from 'react-icons/fa';

const NewsStats = () => {
    const stats = [
        { label: 'Tổng lượt xem', value: '12.8k', icon: <FaEye />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Bài viết đã lên lịch', value: '05', icon: <FaRegCalendarAlt />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Người đóng góp', value: '08', icon: <FaUsers />, color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} text-2xl`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-black tracking-tight">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsStats;
