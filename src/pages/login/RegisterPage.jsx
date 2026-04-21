import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowRight, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    full_name: fullName,
                    phone: phone
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Success! Redirect to login
                alert('Đăng ký thành công! Mời bạn đăng nhập.');
                navigate('/login');
            } else {
                setError(data.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfcf9] relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(#8b1d21 1px, transparent 1px), linear-gradient(90deg, #8b1d21 1px, transparent 1px)',
                     backgroundSize: '40px 40px' 
                 }}>
            </div>

            {/* Register Card */}
            <div className="relative z-10 w-full max-w-md bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-gray-100 mx-4 my-8">
                <div className="text-center mb-8">
                    <div className="w-24 h-[1px] bg-gray-300 mx-auto mb-4"></div>
                    <p className="text-[10px] tracking-[0.2em] text-gray-500 font-medium mb-6 uppercase">Gia nhập cộng đồng</p>
                    
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#8b1d21] leading-tight mb-1">
                        Đăng Ký Tài Khoản
                    </h1>
                    <p className="font-serif italic text-gray-600 text-sm">Nhà Hát Kịch Việt Nam</p>
                    <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-6"></div>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs p-3 rounded border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#8b6b4d] tracking-wider uppercase">Họ và tên</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full px-4 py-3 bg-[#f9f8f4] border border-gray-200 rounded-sm focus:outline-none focus:border-[#8b1d21] transition-colors text-sm pl-10"
                                required
                            />
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#8b6b4d] tracking-wider uppercase">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-[#f9f8f4] border border-gray-200 rounded-sm focus:outline-none focus:border-[#8b1d21] transition-colors text-sm pl-10"
                                required
                            />
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#8b6b4d] tracking-wider uppercase">Số điện thoại</label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="0123 456 789"
                                className="w-full px-4 py-3 bg-[#f9f8f4] border border-gray-200 rounded-sm focus:outline-none focus:border-[#8b1d21] transition-colors text-sm pl-10"
                                required
                            />
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#8b6b4d] tracking-wider uppercase">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-4 py-3 bg-[#f9f8f4] border border-gray-200 rounded-sm focus:outline-none focus:border-[#8b1d21] transition-colors text-sm pl-10"
                                required
                            />
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#8b6b4d] tracking-wider uppercase">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-4 py-3 bg-[#f9f8f4] border border-gray-200 rounded-sm focus:outline-none focus:border-[#8b1d21] transition-colors text-sm pl-10"
                                required
                            />
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#8b1d21] text-white py-4 rounded-sm font-bold tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-[#6e171a] transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                        >
                            <span>{loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}</span>
                            {!loading && <FaArrowRight className="text-[10px]" />}
                        </button>
                    </div>
                    
                    <div className="text-center font-serif text-sm text-gray-500 pt-4">
                        Đã có tài khoản? <Link to="/login" className="text-[#8b1d21] font-bold hover:underline">Đăng nhập tại đây</Link>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <div className="inline-block p-2 bg-[#f9f8f4] border border-gray-100 rounded-sm">
                        <div className="w-1.5 h-1.5 bg-[#8b1d21] rotate-45"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
