import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaHeading, FaAlignLeft, FaPlus, FaEdit } from 'react-icons/fa';
import API_URL from '../../../config/api';

const AddNewsModal = ({ isOpen, onClose, onRefresh, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_url: ''
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title || '',
                    content: initialData.content || '',
                    image_url: initialData.image_url || ''
                });
            } else {
                setFormData({ title: '', content: '', image_url: '' });
            }
            setMessage('');
        }
    }, [isOpen, initialData]);

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
                setFormData(prev => ({ ...prev, image_url: data.url }));
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

        const userStr = localStorage.getItem('user');
        let admin_id = null;
        if (userStr) {
            try {
                admin_id = JSON.parse(userStr).id;
            } catch (e) {}
        }

        const method = initialData ? 'PUT' : 'POST';
        const url = initialData 
            ? `${API_URL}/api/admin/news/${initialData.id}` 
            : `${API_URL}/api/admin/news`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    admin_id: admin_id // Fallback for backend
                }),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setMessage(initialData ? 'Cập nhật thành công!' : 'Thêm tin tức thành công!');
                if (!initialData) setFormData({ title: '', content: '', image_url: '' });
                setTimeout(() => {
                    onRefresh();
                    onClose();
                }, 1500);
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
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative z-10 w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-950 flex items-center gap-3">
                        {initialData ? <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FaEdit /></div> : <div className="p-2 bg-red-100 rounded-lg text-red-600"><FaPlus /></div>} 
                        {initialData ? 'CHỈNH SỬA TIN TỨC' : 'THÊM TIN TỨC MỚI'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-all">
                        <FaTimes size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center animate-in slide-in-from-top-2 duration-300 ${message.includes('thành công') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaHeading className="text-red-500" /> Tiêu đề tin tức
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-slate-300 font-bold"
                                placeholder="Nhập tiêu đề ấn tượng cho bài viết..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaAlignLeft className="text-red-500" /> Nội dung chi tiết
                            </label>
                            <textarea
                                required
                                rows="6"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-slate-300 font-semibold leading-relaxed resize-none"
                                placeholder="Viết nội dung bài viết tại đây..."
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaImage className="text-red-500" /> Ảnh bìa tin tức
                            </label>
                            <div className="relative group overflow-hidden bg-slate-50 border border-slate-200 rounded-xl transition-all hover:border-red-600/30">
                                <div className="aspect-[21/9] flex flex-col items-center justify-center p-4">
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-2 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ĐANG TẢI...</span>
                                        </div>
                                    ) : formData.image_url ? (
                                        <div className="relative w-full h-full group/preview">
                                            <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-all rounded-lg">
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest bg-red-600/80 px-3 py-1.5 rounded-full">THAY ĐỔI ẢNH</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-red-600/50 transition-colors">
                                            <FaImage size={32} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">CHỌN ẢNH BÌA</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-[2] py-4 px-6 rounded-2xl text-white font-black tracking-wide transition-all disabled:opacity-50 shadow-lg active:scale-95 ${initialData ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>ĐANG XỬ LÝ...</span>
                                </div>
                            ) : (initialData ? 'LƯU THAY ĐỔI' : 'XUẤT BẢN TIN TỨC')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewsModal;
