import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaPlus, FaHeading, FaAlignLeft, FaImage } from 'react-icons/fa';
import API_URL from '../../config/api';

const CreateNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage({ text: '', type: '' });

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
                setMessage({ text: 'Tải ảnh lên thành công!', type: 'success' });
            } else {
                setMessage({ text: data.message || 'Lỗi khi tải ảnh.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Lỗi kết nối máy chủ khi tải ảnh.', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const userStr = localStorage.getItem('user');
        let admin_id = '';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-ID': admin_id
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ text: 'Đăng bài viết mới thành công!', type: 'success' });
                setTimeout(() => {
                    navigate('/admin/news');
                }, 1500);
            } else {
                setMessage({ text: data.message || 'Có lỗi xảy ra khi đăng bài.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Lỗi kết nối máy chủ.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button 
                    onClick={() => navigate('/admin/news')}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-red-600 hover:border-red-100 transition-all shadow-sm active:scale-95"
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">SOẠN TIN TỨC MỚI</h1>
                    <p className="text-sm font-medium text-slate-500">Tạo và xuất bản nội dung truyền thông mới cho Nhà hát.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                {message.text && (
                    <div className={`mx-8 mt-8 p-4 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="p-8 space-y-8">
                    {/* Cover Image Section */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <FaImage className="text-red-600" /> Ảnh bìa tin tức chuyên nghiệp
                        </label>
                        <div className="relative aspect-[21/9] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group cursor-pointer overflow-hidden hover:border-red-600/30 transition-all shadow-inner">
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 border-3 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ĐANG TẢI...</span>
                                </div>
                            ) : formData.image_url ? (
                                <>
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-red-600 px-4 py-2 rounded-full">THAY ĐỔI ẢNH BÌA</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-5 bg-white rounded-full shadow-lg text-slate-300 group-hover:text-red-600 transition-colors">
                                        <FaCamera size={32} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CHỌN ẢNH BÌA (21:9)</span>
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

                    {/* Content Section */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaHeading className="text-red-600" /> Tiêu đề bài viết
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Nhập tiêu đề bài viết..."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:border-red-600/50 focus:bg-white transition-all shadow-sm placeholder:text-slate-300 font-bold text-xl"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaAlignLeft className="text-red-600" /> Nội dung bài viết chi tiết
                            </label>
                            <textarea
                                rows="12"
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Viết nội dung tin tức tại đây..."
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-8 py-6 text-slate-900 focus:outline-none focus:border-red-600/50 focus:bg-white transition-all shadow-sm resize-none placeholder:text-slate-300 font-medium leading-relaxed"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/news')}
                        className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors px-4"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-4 px-12 py-5 bg-red-600 text-white text-sm font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/25 disabled:opacity-50 active:scale-95 uppercase tracking-wider"
                    >
                        <FaPlus size={18} />
                        {loading ? 'ĐANG XỬ LÝ...' : 'XUẤT BẢN TIN TỨC'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNews;
