import React from 'react';
import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaTag, FaStar, FaTheaterMasks } from 'react-icons/fa';

const PerformanceList = ({ performances, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mb-6"></div>
                <p className="text-gray-500 font-black tracking-[0.2em] text-xs uppercase">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (performances.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-200">
                <FaTheaterMasks className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Không tìm thấy vở diễn nào</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {performances.map((perf) => (
                <div 
                    key={perf.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group flex flex-col h-full transform hover:-translate-y-1"
                >
                    {/* Poster Section */}
                    <div className="relative h-[260px] overflow-hidden bg-gray-100">
                        <img 
                            src={perf.poster_url || '/placeholder-poster.jpg'} 
                            alt={perf.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                        
                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md border ${
                                perf.status === 'active' 
                                    ? 'bg-green-500/90 text-white border-green-400/50' 
                                    : 'bg-gray-800/90 text-white border-gray-600/50'
                            }`}>
                                {perf.status === 'active' ? 'Đang diễn' : 'Tạm ngưng'}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-1 relative bg-white">
                        {/* Floating Type Badge */}
                        <div className="absolute -top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 transform group-hover:scale-105 transition-transform duration-300">
                            <FaTag /> {perf.type || 'Kịch'}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 pr-14 group-hover:text-red-600 transition-colors line-clamp-2">
                            {perf.title}
                        </h3>
                        
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2.5 text-gray-500">
                                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                    <FaClock className="text-xs" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{perf.duration} phút</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-500">
                                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                    <FaCalendarAlt className="text-xs" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{perf.plays ? perf.plays.length : 0} suất diễn</span>
                            </div>
                        </div>

                        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100">
                            <button 
                                onClick={() => onEdit(perf)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                            >
                                <FaEdit className="text-xs" /> Chỉnh sửa
                            </button>
                            <button 
                                onClick={() => onDelete(perf.id)}
                                className="w-[34px] h-[34px] flex items-center justify-center text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-all active:scale-95 border border-gray-100 hover:border-red-100"
                                title="Xóa vở diễn"
                            >
                                <FaTrash className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PerformanceList;
