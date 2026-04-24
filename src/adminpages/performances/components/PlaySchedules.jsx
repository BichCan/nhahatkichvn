import React, { useState } from 'react';
import { FaPlus, FaTrash, FaClock, FaCalendarDay, FaExclamationTriangle } from 'react-icons/fa';
import API_URL from '../../../config/api';

const PlaySchedules = ({ performanceId, plays, onRefresh }) => {
    const [newPlay, setNewPlay] = useState({
        date: '',
        time: '20:00',
        status: 'available'
    });
    const [adding, setAdding] = useState(false);

    const handleAddPlay = async (e) => {
        e.preventDefault();
        if (!newPlay.date || !newPlay.time) {
            alert('Vui lòng chọn đầy đủ ngày và giờ');
            return;
        }

        const userStr = localStorage.getItem('user');
        let admin_id = '1';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        setAdding(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/plays`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    performance_id: performanceId,
                    start_time: `${newPlay.date} ${newPlay.time}:00`,
                    status: newPlay.status,
                    admin_id
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                onRefresh();
                setNewPlay({ date: '', time: '20:00', status: 'available' });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding play:', error);
            alert('Lỗi khi thêm suất diễn.');
        } finally {
            setAdding(false);
        }
    };

    const handleDeletePlay = async (playId) => {
        if (!window.confirm('Xác nhận xóa suất diễn này?')) return;

        const userStr = localStorage.getItem('user');
        let admin_id = '1';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/plays/${playId}?admin_id=${admin_id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                onRefresh();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting play:', error);
            alert('Lỗi khi xóa suất diễn.');
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const inputCls = "w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400";
    const fieldLabel = (label, icon) => (
        <label className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
        </label>
    );

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Add New Showtime Form */}
            <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <form onSubmit={handleAddPlay} className="flex flex-wrap items-end gap-5">
                    <div className="flex-1 min-w-[200px]">
                        {fieldLabel('Ngày diễn', <FaCalendarDay />)}
                        <input 
                            type="date"
                            value={newPlay.date}
                            onChange={(e) => setNewPlay({...newPlay, date: e.target.value})}
                            className={inputCls}
                        />
                    </div>
                    <div className="w-40">
                        {fieldLabel('Giờ diễn', <FaClock />)}
                        <input 
                            type="time"
                            value={newPlay.time}
                            onChange={(e) => setNewPlay({...newPlay, time: e.target.value})}
                            className={inputCls}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={adding}
                        className="py-3 px-6 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                        <FaPlus /> {adding ? 'Đang thêm...' : 'Thêm suất diễn'}
                    </button>
                </form>
            </div>

            {/* List of Showtimes */}
            <div className="divide-y divide-gray-100">
                {plays.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                            <FaExclamationTriangle className="text-gray-300 text-2xl" />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Chưa có suất diễn nào được thiết lập</p>
                    </div>
                ) : (
                    plays.map((play) => (
                        <div key={play.id} className="p-6 hover:bg-gray-50/80 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-8 flex-1 overflow-x-auto">
                                <div className="flex items-center gap-4 w-[220px] shrink-0">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                                        <FaCalendarDay />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 mb-0.5">
                                            {formatDate(play.start_time)}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">Ngày biểu diễn</span>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-4 border-l border-gray-100 pl-8 w-[200px] shrink-0">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                        <FaClock />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 mb-0.5">
                                            {formatTime(play.start_time)}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">Giờ bắt đầu</span>
                                    </div>
                                </div>
                                <div className="w-[120px] shrink-0">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                        play.status === 'available' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {play.status === 'available' ? 'Còn chỗ' : 'Hết chỗ'}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeletePlay(play.id)}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 border border-transparent hover:border-red-100"
                                title="Xóa suất diễn"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PlaySchedules;
