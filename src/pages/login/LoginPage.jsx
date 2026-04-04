import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Store user info in localStorage for frontend use
                localStorage.setItem('user', JSON.stringify(data.user));
                // Dispatch custom event to notify other components (like UserMenu)
                window.dispatchEvent(new Event('userLoginStatusChanged'));
                navigate('/');
            } else {
                setError(data.message || 'Đăng nhập thất bại');
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

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-gray-100 mx-4">
                <div className="text-center mb-8">
                    <div className="w-24 h-[1px] bg-gray-300 mx-auto mb-4"></div>
                    <p className="text-[10px] tracking-[0.2em] text-gray-500 font-medium mb-6 uppercase">Chào mừng quý khách</p>
                    
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#8b1d21] leading-tight mb-1">
                        Nhà Hát Kịch <br /> Việt Nam
                    </h1>
                    <p className="font-serif italic text-gray-600 text-sm">The Sanctuary of Dramatic Arts</p>
                    <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-6"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs p-3 rounded border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#8b6b4d] tracking-wider uppercase">Tên đăng nhập / Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="w-full px-4 py-3 bg-[#f9f8f4] border border-gray-200 rounded-sm focus:outline-none focus:border-[#8b1d21] transition-colors text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-[#8b6b4d] tracking-wider uppercase">Mật khẩu</label>
                            <Link to="/forgot-password" size="sm" className="text-[10px] italic text-[#8b6b4d] hover:text-[#8b1d21]">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            className="w-full px-4 py-3 bg-[#f9f8f4] border border-gray-200 rounded-sm focus:outline-none focus:border-[#8b1d21] transition-colors text-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            id="remember" 
                            className="w-3 h-3 rounded border-gray-300 text-[#8b1d21] focus:ring-[#8b1d21]"
                        />
                        <label htmlFor="remember" className="text-[11px] text-gray-500">Ghi nhớ đăng nhập</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8b1d21] text-white py-4 rounded-sm font-bold tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-[#6e171a] transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                    >
                        <span>{loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}</span>
                        {!loading && <FaArrowRight className="text-[10px]" />}
                    </button>
                    
                    <div className="text-center py-2">
                        <span className="text-[10px] italic text-gray-400">hoặc</span>
                    </div>

                    <Link 
                        to="/register" 
                        className="w-full border border-gray-200 text-gray-600 py-4 rounded-sm font-bold tracking-widest text-[10px] flex items-center justify-center hover:bg-gray-50 transition-all uppercase"
                    >
                        Tạo tài khoản mới
                    </Link>
                </form>

                <div className="mt-12 text-center">
                    <div className="inline-block p-2 bg-[#f9f8f4] border border-gray-100 rounded-sm">
                        <div className="w-1.5 h-1.5 bg-[#8b1d21] rotate-45"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
