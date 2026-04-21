import React, { useState } from 'react';
import { FaTimes, FaImage, FaHeading, FaAlignLeft, FaPlus } from 'react-icons/fa';
import API_URL from '../../../config/api';

const AddNewsModal = ({ isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/api/admin/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setMessage('Thêm tin tức thành công!');
                setFormData({ title: '', content: '', image_url: '' });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaPlus className="text-red-600" /> Thêm tin tức mới
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg text-sm text-center ${message.includes('thành công') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <FaHeading /> Tiêu đề
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Nhập tiêu đề tin tức..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <FaAlignLeft /> Nội dung
                        </label>
                        <textarea
                            required
                            rows="6"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Nhập nội dung tin tức..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <FaImage /> Đường dẫn ảnh (Image URL)
                        </label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/5 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3 bg-red-600 rounded-xl text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Lưu tin tức'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewsModal;
