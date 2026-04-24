import React from 'react';
import { FaTimes, FaUser, FaQuoteLeft } from 'react-icons/fa';

const ArtistDetailModal = ({ isOpen, onClose, artist }) => {
    if (!isOpen || !artist) return null;

    const roleMap = {
        'actor': 'Diễn viên',
        'director': 'Đạo diễn',
        'musician': 'Nhạc công',
        'other': 'Khác'
    };

    const getRoleBadgeStyles = (role) => {
        const r = (role || '').toLowerCase();
        if (r === 'director') return 'bg-purple-50 text-purple-700 border-purple-100';
        if (r === 'musician') return 'bg-orange-50 text-orange-700 border-orange-100';
        if (r === 'other') return 'bg-blue-50 text-blue-700 border-blue-100';
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300 custom-scrollbar">
                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-r from-[#700c1e] to-[#a0122b] relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-10">
                    <div className="relative flex flex-col items-center -mt-16 mb-6">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white p-1.5 shadow-xl ring-4 ring-white/50">
                            {artist.avatar_url || artist.avatar ? (
                                <img 
                                    src={artist.avatar_url || artist.avatar} 
                                    alt={artist.name} 
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 rounded-xl">
                                    <FaUser size={48} />
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                {artist.name}
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleBadgeStyles(artist.role_type)}`}>
                                    {roleMap[artist.role_type] || artist.role_type || 'Diễn viên'}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                    ID: #{String(artist.id).padStart(3, '0')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-[1px] flex-1 bg-gray-100"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiểu sử chi tiết</span>
                                <div className="h-[1px] flex-1 bg-gray-100"></div>
                            </div>
                            
                            <div className="relative bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                <FaQuoteLeft className="absolute top-4 left-4 text-gray-200" size={24} />
                                <p className="text-gray-700 leading-relaxed font-medium italic relative z-10 text-center px-4">
                                    {artist.bio || 'Chưa có thông tin tiểu sử chuyên môn được cập nhật cho nghệ sĩ này.'}
                                </p>
                            </div>
                        </div>

                        {/* Additional Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Trạng thái</p>
                                <p className={`text-sm font-bold flex items-center gap-1.5 ${artist.status === 'INACTIVE' ? 'text-gray-400' : 'text-emerald-600'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${artist.status === 'INACTIVE' ? 'bg-gray-300' : 'bg-emerald-500 animate-pulse'}`}></span>
                                    {artist.status === 'INACTIVE' ? 'Không hoạt động' : 'Đang hoạt động'}
                                </p>
                            </div>
                            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Đơn vị</p>
                                <p className="text-sm font-bold text-gray-900">Nhà hát kịch Việt Nam</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-10 flex justify-center">
                        <button 
                            onClick={onClose}
                            className="px-12 py-3.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
                        >
                            Đóng cửa sổ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistDetailModal;
