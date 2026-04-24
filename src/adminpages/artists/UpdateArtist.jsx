import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaSave, FaUser } from 'react-icons/fa';
import API_URL from '../../config/api';

const UpdateArtist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        role_type: 'actor',
        bio: '',
        avatar_url: '',
        status: 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/artists`);
                const data = await response.json();
                const artist = data.find(a => String(a.id) === id);
                
                if (artist) {
                    setFormData({
                        name: artist.name || '',
                        role_type: artist.role_type || 'actor',
                        bio: artist.bio || '',
                        avatar_url: artist.avatar_url || artist.avatar || '',
                        status: artist.status || 'ACTIVE'
                    });
                } else {
                    setMessage({ text: 'Không tìm thấy thông tin nghệ sĩ.', type: 'error' });
                }
            } catch (error) {
                console.error('Error fetching artist:', error);
                setMessage({ text: 'Lỗi khi tải dữ liệu nghệ sĩ.', type: 'error' });
            } finally {
                setFetching(false);
            }
        };

        fetchArtistData();
    }, [id]);

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
                setFormData(prev => ({ ...prev, avatar_url: data.url }));
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
        let admin_id = '1';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/artists/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-ID': admin_id
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ text: 'Cập nhật thông tin nghệ sĩ thành công!', type: 'success' });
                setTimeout(() => {
                    navigate('/admin/artists');
                }, 1500);
            } else {
                setMessage({ text: data.message || 'Có lỗi xảy ra khi cập nhật.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Lỗi kết nối máy chủ.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button 
                    onClick={() => navigate('/admin/artists')}
                    className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-red-600 hover:border-red-100 transition-all shadow-sm active:scale-95"
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">CẬP NHẬT NGHỆ SĨ</h1>
                    <p className="text-sm font-medium text-gray-500">Chỉnh sửa thông tin hồ sơ lưu trữ của nghệ sĩ.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                {message.text && (
                    <div className={`mx-8 mt-8 p-4 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="p-8 space-y-10">
                    {/* Identity Section */}
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Avatar */}
                        <div className="w-full md:w-64 space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ảnh đại diện chuyên môn</label>
                            <div className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 group relative cursor-pointer overflow-hidden hover:border-red-600/30 transition-all">
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 border-3 border-gray-100 border-t-red-600 rounded-full animate-spin"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">UPLOADING...</span>
                                    </div>
                                ) : formData.avatar_url ? (
                                    <>
                                        <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">THAY ĐỔI ẢNH</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-full shadow-md text-gray-300 group-hover:text-red-600 transition-colors">
                                            <FaCamera size={32} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">CHỌN ẢNH CHÂN DUNG</span>
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

                        {/* Fields */}
                        <div className="flex-1 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ và tên nghệ sĩ</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nhập họ và tên đầy đủ..."
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 focus:outline-none focus:border-red-600/50 focus:bg-white transition-all shadow-sm placeholder:text-gray-300 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò / Chức danh</label>
                                <div className="relative">
                                    <select
                                        value={formData.role_type}
                                        onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 appearance-none focus:outline-none focus:border-red-600/50 focus:bg-white transition-all shadow-sm font-medium"
                                    >
                                        <option value="actor">Diễn viên</option>
                                        <option value="director">Đạo diễn</option>
                                        <option value="musician">Nhạc công</option>
                                        <option value="other">Khác</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái hoạt động</label>
                                <div className="relative">
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 appearance-none focus:outline-none focus:border-red-600/50 focus:bg-white transition-all shadow-sm font-medium"
                                    >
                                        <option value="ACTIVE">Đang hoạt động</option>
                                        <option value="INACTIVE">Không hoạt động</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiểu sử chuyên môn chi tiết</label>
                        <textarea
                            rows="8"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Mô tả quá trình hoạt động nghệ thuật, các tác phẩm tiêu biểu và giải thưởng..."
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-900 focus:outline-none focus:border-red-600/50 focus:bg-white transition-all shadow-sm resize-none placeholder:text-gray-300 font-medium leading-relaxed"
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/artists')}
                        className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Hủy bỏ thay đổi
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 px-10 py-4 bg-red-600 text-white text-sm font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 active:scale-95"
                    >
                        <FaSave size={16} />
                        {loading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateArtist;
