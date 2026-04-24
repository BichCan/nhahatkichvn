import React from 'react';
import { FaEdit, FaTrash, FaEye, FaUser } from 'react-icons/fa';

const ArtistList = ({ artists, loading, onEdit, onDelete, onView }) => {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
            </div>
        );
    }

    // Helper for formatting ID like #VA-001
    const formatId = (id) => `${String(id).padStart(3, '0')}`;

    const roleMap = {
        'actor': 'Diễn viên',
        'director': 'Đạo diễn',
        'musician': 'Nhạc công',
        'other': 'Khác'
    };

    // Helper for role color indicator
    const getRoleStyles = (role) => {
        const r = (role || '').toLowerCase();
        if (r === 'director') return { dot: 'bg-purple-500', text: 'text-purple-900' };
        if (r === 'musician') return { dot: 'bg-orange-500', text: 'text-orange-900' };
        if (r === 'other') return { dot: 'bg-blue-500', text: 'text-blue-900' };
        return { dot: 'bg-emerald-500', text: 'text-emerald-900' }; // Default for actor
    };

    return (
        <div className="w-full bg-white rounded-xl overflow-x-auto border border-gray-100 shadow-sm custom-scrollbar">
            <div className="min-w-[900px]">
                {/* Table Header */}
                <div className="grid grid-cols-[80px_minmax(250px,2fr)_150px_3fr_120px] gap-4 px-8 py-4 bg-white border-b border-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">ID</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">THÔNG TIN NGHỆ SĨ</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">VAI TRÒ</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">TIỂU SỬ</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">THAO TÁC</div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-gray-50">
                {artists.map((artist) => {
                    const roleStyle = getRoleStyles(artist.role_type);
                    return (
                        <div 
                            key={artist.id} 
                            className="grid grid-cols-[80px_minmax(250px,2fr)_150px_3fr_120px] gap-4 px-8 py-5 items-center hover:bg-gray-50/50 transition-colors group"
                        >
                            {/* ID Column */}
                            <div className="font-serif font-bold text-red-900/40 text-sm">
                                {formatId(artist.id)}
                            </div>

                            {/* Profile Column */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                    {artist.avatar_url || artist.avatar ? (
                                        <img src={artist.avatar_url || artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FaUser />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className=" font-bold text-gray-900 truncate tracking-tight text-lg leading-tight">{artist.name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`w-1 h-1 rounded-full ${roleStyle.dot}`}></span>
                                <span className={`text-[12px] font-bold ${roleStyle.text}`}>
                                    {roleMap[artist.role_type] || artist.role_type || 'Diễn viên'}
                                </span>
                            </div>

                            {/* Bio Column */}
                            <div className="text-gray-500 text-sm truncate max-w-full font-medium opacity-80">
                                {artist.bio || 'Chưa có thông tin tiểu sử chuyên môn...'}
                            </div>

                            {/* Actions Column */}
                            <div className="flex items-center justify-end gap-2 px-1">
                                <button 
                                    onClick={() => onView(artist)}
                                    className="p-2 text-red-900/60 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all"
                                    title="Xem"
                                >
                                    <FaEye size={16} />
                                </button>
                                <button 
                                    onClick={() => onEdit(artist)}
                                    className="p-2 text-red-900/60 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all"
                                    title="Sửa"
                                >
                                    <FaEdit size={16} />
                                </button>
                                <button 
                                    onClick={() => onDelete(artist.id)}
                                    className="p-2 text-red-900/60 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all"
                                    title="Xóa"
                                >
                                    <FaTrash size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>


            {artists.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-gray-400 font-serif italic text-lg leading-relaxed">Hiện tại chưa có dữ liệu nghệ sĩ để hiển thị.</p>
                </div>
            )}
            </div>
        </div>
    );
};

export default ArtistList;
