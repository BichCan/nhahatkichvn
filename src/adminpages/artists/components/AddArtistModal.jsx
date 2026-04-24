import React, { useState, useEffect } from 'react';
import { FaTimes, FaCamera, FaSave } from 'react-icons/fa';
import API_URL from '../../../config/api';

const AddArtistModal = ({ isOpen, onClose, onRefresh, artistData = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        role_type: 'actor',
        bio: '',
        avatar_url: '',
        status: 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (artistData) {
            setFormData({
                name: artistData.name || '',
                role_type: artistData.role_type || 'actor',
                bio: artistData.bio || '',
                avatar_url: artistData.avatar_url || '',
                status: artistData.status || 'ACTIVE'
            });
        } else {
            setFormData({
                name: '',
                role_type: 'actor',
                bio: '',
                avatar_url: '',
                status: 'ACTIVE'
            });
        }
        setMessage('');
    }, [artistData, isOpen]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage('');

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await fetch(`${API_URL}/api/admin/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, avatar_url: data.url }));
                setMessage('Tải ảnh lên thành công!');
            } else {
                setMessage(data.message || 'Lỗi khi tải ảnh.');
            }
        } catch (error) {
            setMessage('Lỗi kết nối máy chủ khi tải ảnh.');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const method = artistData ? 'PUT' : 'POST';
        const url = artistData 
            ? `${API_URL}/api/admin/artists/${artistData.id}`
            : `${API_URL}/api/admin/artists`;

        const userStr = localStorage.getItem('user');
        let admin_id = '1';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-ID': admin_id
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setMessage(artistData ? 'Cập nhật thành công!' : 'Thêm nghệ sĩ thành công!');
                setTimeout(() => {
                    onRefresh();
                    onClose();
                }, 1000);
            } else {
                setMessage(data.message || 'Có lỗi xảy ra.');
            }
        } catch (error) {
            setMessage('Lỗi kết nối máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-[#700c1e] mb-1">
                            {artistData ? 'Cập nhật Nghệ sĩ' : 'Thêm Nghệ sĩ Mới'}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium tracking-wide">
                            Cập nhật hồ sơ lưu trữ cho đội ngũ nghệ sĩ của nhà hát.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-4 flex flex-col gap-8">
                    {message && (
                        <div className={`p-3 rounded-lg text-xs font-bold text-center ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    {/* Top Section: Avatar + Identity */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Box */}
                        <div className="w-full md:w-[200px] flex-shrink-0 space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ảnh đại diện</label>
                              <div className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 group relative cursor-pointer overflow-hidden hover:border-[#700c1e]/30 transition-all">
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#700c1e] rounded-full animate-spin"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">UPLOADING...</span>
                                    </div>
                                ) : formData.avatar_url ? (
                                    <>
                                        <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">THAY ĐỔI ẢNH</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 bg-white rounded-full shadow-sm text-gray-400 group-hover:text-[#700c1e] transition-colors">
                                            <FaCamera size={24} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">CHỌN ẢNH</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                              </div>
                        </div>

                        {/* Identity Fields */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ và tên</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Lê Thanh Thảo"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#700c1e] placeholder:text-gray-300 transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò</label>
                                <div className="relative">
                                    <select
                                        value={formData.role_type}
                                        onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:border-[#700c1e] transition-all shadow-sm"
                                    >
                                        <option value="actor">Diễn viên</option>
                                        <option value="director">Đạo diễn</option>
                                        <option value="musician">Nhạc công</option>
                                        <option value="other">Khác</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</label>
                                <div className="relative">
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:border-[#700c1e] transition-all shadow-sm"
                                    >
                                        <option value="ACTIVE">Đang hoạt động</option>
                                        <option value="INACTIVE">Không hoạt động</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiểu sử chuyên môn</label>
                        <textarea
                            rows="4"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Mô tả lịch sử hoạt động, phong cách nghệ thuật và các tác phẩm tiêu biểu..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#700c1e] placeholder:text-gray-300 transition-all shadow-sm resize-none"
                        ></textarea>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-6 pt-4 pb-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm font-bold text-[#700c1e]/70 hover:text-[#700c1e] transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#700c1e] text-white text-sm font-bold rounded-lg hover:bg-[#5a0a18] transition-all shadow-lg shadow-[#700c1e]/20 disabled:opacity-50 active:scale-95"
                        >
                            <FaSave size={14} />
                            {loading ? 'Đang lưu...' : 'Lưu Nghệ Sĩ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddArtistModal;
