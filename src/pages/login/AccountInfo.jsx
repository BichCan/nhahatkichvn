import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AccountInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/check-session', { credentials: 'include' });
                const data = await response.json();
                if (data.logged_in) {
                    setUser(data.user);
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.error("Failed to fetch user data", err);
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

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
                                    className="w-full py-3 bg-[#8b1d21] text-white text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#6e171a] transition-all flex items-center justify-center gap-2"
                                >
                                    <FaHistory /> Xem lịch sử đặt vé
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-sm shadow-md border border-gray-50 relative">
                            <h3 className="text-lg font-serif font-bold text-[#8b1d21] mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#8b1d21]/10 rounded-full flex items-center justify-center text-[#8b1d21]">
                                    <FaIdCard className="text-sm" />
                                </span>
                                Thông tin định danh
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="border-b border-gray-100 pb-4">
                                    <label className="text-[10px] font-bold text-[#8b6b4d] tracking-widest uppercase mb-1 block">Họ và tên</label>
                                    <p className="text-[#4a0012] font-medium">{user.full_name}</p>
                                </div>
                                
                                <div className="border-b border-gray-100 pb-4">
                                    <label className="text-[10px] font-bold text-[#8b6b4d] tracking-widest uppercase mb-1 block">Địa chỉ Email</label>
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-gray-400 text-xs" />
                                        <p className="text-[#4a0012] font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div className="border-b border-gray-100 pb-4">
                                    <label className="text-[10px] font-bold text-[#8b6b4d] tracking-widest uppercase mb-1 block">ID người dùng</label>
                                    <p className="text-gray-400 font-mono text-xs">#{user.id}</p>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <p className="text-[11px] text-gray-400 italic">
                                    * Để thay đổi thông tin cá nhân hoặc mật khẩu, vui lòng liên hệ bộ phận hỗ trợ của Nhà Hát.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;
