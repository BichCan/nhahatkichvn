import React, { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../config/api';

export default function PerformanceActions({ performance }) {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!performance?.id) return;

        fetch('http://127.0.0.1:5000/api/plays')
            .then(res => res.json())
            .then(data => {
                // Filter schedules for this specific performance
                const filtered = data.filter(s => s.p_id === performance.id);
                // Sort by date and time
                const sorted = filtered.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateA - dateB;
                });
                setSchedules(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch schedules:", err);
                setLoading(false);
            });
    }, [performance?.id]);

    const handleBookNow = () => {
        navigate(`/dat-ve/${performance.id}`);
    };

    const handleSelectSchedule = (schedule) => {
        navigate(`/dat-ve/${performance.id}`, {
            state: {
                preSelectedDate: schedule.date,
                preSelectedTime: schedule.time
            }
        });
    };

    const formatDateVn = (dateStr) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('vi-VN', options);
        } catch (e) {
            return dateStr;
        }
    };

    const getDayOfWeek = (dateStr) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
            return days[date.getDay()];
        } catch (e) {
            return "";
        }
    };

    return (
        <div className="mt-6 space-y-4">
            <button 
                onClick={handleBookNow}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30 active:scale-95"
            >
                <span className="material-symbols-outlined ">confirmation_number</span>
                ĐẶT VÉ NGAY
            </button>

            <div className="bg-slate-800 text-white border border-slate-700 p-4 rounded-xl shadow-sm">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-orange-500" />
                    Suất diễn gần nhất
                </h4>
                
                <div className="space-y-3">
                    {loading ? (
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    ) : schedules.length > 0 ? (
                        schedules.slice(0, 3).map((s, idx) => (
                            <div 
                                key={s.id || idx}
                                onClick={() => handleSelectSchedule(s)}
                                className="flex items-center justify-between p-3 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-center min-w-[60px] border-r border-slate-700 pr-3">
                                        <p className="text-orange-500 font-bold text-sm">{s.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{getDayOfWeek(s.date)}</p>
                                        <p className="text-[10px] text-slate-400">{formatDateVn(s.date)}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 group-hover:text-orange-500 text-sm transition-colors">arrow_forward_ios</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 italic py-2 text-center">Hiện chưa có suất chiếu nào</p>
                    )}
                </div>
            </div>
        </div>
    );
}