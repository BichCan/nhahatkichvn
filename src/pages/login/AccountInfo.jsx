import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaHistory, FaPhone, FaLock, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AccountInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: '', email: '', phone: '' });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/check-session', { credentials: 'include' });
                const data = await response.json();
                if (data.logged_in) {
                    setUser(data.user);
                    setEditForm({
                        full_name: data.user.full_name,
                        email: data.user.email,
                        phone: data.user.phone || ''
                    });
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.error("Failed to fetch user data", err);
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    setUser(parsed);
                    setEditForm({
                        full_name: parsed.full_name,
                        email: parsed.email,
                        phone: parsed.phone || ''
                    });
                } else {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsEditing(false);
                alert("Cập nhật thông tin thành công!");
                // Broadcast for other components (like UserMenu)
                window.dispatchEvent(new Event('userLoginStatusChanged'));
            } else {
                alert(data.message || "Cập nhật thất bại");
            }
        } catch (err) {
            alert("Lỗi kết nối máy chủ");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            alert("Mật khẩu mới không khớp!");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    old_password: passwordForm.old_password,
                    new_password: passwordForm.new_password
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setShowPasswordModal(false);
                setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
                alert("Đổi mật khẩu thành công!");
            } else {
                alert(data.message || "Đổi mật khẩu thất bại");
            }
        } catch (err) {
            alert("Lỗi kết nối máy chủ");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b1d21]"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#fdfcf9] pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-[#8b1d21] mb-2">Thông Tin Tài Khoản</h1>
                    <p className="text-gray-500 italic font-serif">Quản lý thông tin cá nhân của bạn tại Nhà Hát Kịch Việt Nam</p>
                    <div className="w-24 h-[1px] bg-[#D4BAB6] mx-auto mt-6"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Avatar & Quick Info */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-8 rounded-sm shadow-xl border border-gray-100 text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#8b1d21]"></div>
                            <div className="w-32 h-32 bg-[#f9f8f4] border-2 border-[#D4BAB6] rounded-full mx-auto flex items-center justify-center mb-6 relative z-10">
                                <FaUser className="text-5xl text-[#D4BAB6]" />
                            </div>
                            <h2 className="text-xl font-bold text-[#4a0012] mb-1">{user.full_name}</h2>
                            <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => navigate('/thong-tin-dat-ve')}
                                    className="w-full py-3 border border-[#8b1d21] text-[#8b1d21] text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-[#8b1d21] hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <FaHistory /> Lịch sử đặt vé
                                </button>
                                <button 
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full py-3 bg-gray-100 text-gray-600 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaLock /> Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-sm shadow-md border border-gray-50 relative">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-serif font-bold text-[#8b1d21] flex items-center gap-3">
                                    <span className="w-8 h-8 bg-[#8b1d21]/10 rounded-full flex items-center justify-center text-[#8b1d21]">
                                        <FaIdCard className="text-sm" />
                                    </span>
                                    Thông tin cá nhân
                                </h3>
                                {!isEditing ? (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-[#8b1d21] hover:underline flex items-center gap-1"
                                    >
                                        <FaEdit /> Chỉnh sửa
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={handleUpdateProfile}
                                            className="text-[10px] font-bold uppercase tracking-widest text-green-600 hover:underline flex items-center gap-1"
                                        >
                                            <FaCheck /> Lưu
                                        </button>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:underline flex items-center gap-1"
                                        >
                                            <FaTimes /> Hủy
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-6">
                                {/* Name Row */}
                                <div className={`pb-4 border-b border-gray-100 transition-all ${isEditing ? 'bg-gray-50 p-3 rounded-lg border-none' : ''}`}>
                                    <label className="text-[10px] font-bold text-[#8b6b4d] tracking-widest uppercase mb-1 block">Họ và tên</label>
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            value={editForm.full_name}
                                            onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                            className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8b1d21]"
                                        />
                                    ) : (
                                        <p className="text-[#4a0012] font-medium">{user.full_name}</p>
                                    )}
                                </div>
                                
                                {/* Email Row */}
                                <div className={`pb-4 border-b border-gray-100 transition-all ${isEditing ? 'bg-gray-50 p-3 rounded-lg border-none' : ''}`}>
                                    <label className="text-[10px] font-bold text-[#8b6b4d] tracking-widest uppercase mb-1 block">Địa chỉ Email</label>
                                    {isEditing ? (
                                        <input 
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8b1d21]"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-gray-400 text-xs" />
                                            <p className="text-[#4a0012] font-medium">{user.email}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Row */}
                                <div className={`pb-4 border-b border-gray-100 transition-all ${isEditing ? 'bg-gray-50 p-3 rounded-lg border-none' : ''}`}>
                                    <label className="text-[10px] font-bold text-[#8b6b4d] tracking-widest uppercase mb-1 block">Số điện thoại</label>
                                    {isEditing ? (
                                        <input 
                                            type="tel"
                                            value={editForm.phone}
                                            placeholder="Nhập số điện thoại"
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8b1d21]"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-gray-400 text-xs" />
                                            <p className="text-[#4a0012] font-medium">{user.phone || 'Chưa cập nhật'}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pb-4">
                                    <label className="text-[10px] font-bold text-[#8b6b4d] tracking-widest uppercase mb-1 block">ID người dùng</label>
                                    <p className="text-gray-400 font-mono text-xs">#{user.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-serif font-bold text-[#8b1d21]">Đổi Mật Khẩu</h3>
                            <button 
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Mật khẩu cũ</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwordForm.old_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, old_password: e.target.value})}
                                    className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8b1d21]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Mật khẩu mới</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwordForm.new_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                    className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8b1d21]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Xác nhận mật khẩu</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwordForm.confirm_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                                    className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8b1d21]"
                                />
                            </div>
                            <div className="pt-4">
                                <button 
                                    type="submit"
                                    className="w-full py-4 bg-[#8b1d21] text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-[#6e171a] transition-all shadow-lg"
                                >
                                    Cập nhật mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountInfo;
