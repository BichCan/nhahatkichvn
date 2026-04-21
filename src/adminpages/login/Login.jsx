import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: credentials.identifier, 
                    password: credentials.password 
                }),
            });

            const data = await response.json();

            if (data.success) {
                const user = data.user;
                
                // CRITICAL: Verify that the user has the 'admin' role
                if (user.role === 'admin') {
                    localStorage.setItem('user', JSON.stringify(user));
                    // Dispatch event so AdminLayout can react immediately
                    window.dispatchEvent(new Event('userLoginStatusChanged'));
                    navigate('/admin/dashboard');
                } else {
                    setError('Tài khoản của bạn không có quyền truy cập trang quản trị.');
                }
            } else {
                setError(data.message || 'Email hoặc mật khẩu không chính xác.');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi kết nối hệ thống. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/admin_login_bg.png')" }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md p-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mx-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Nhà hát kịch Việt Nam</h2>
                    <p className="text-white/60 text-sm uppercase tracking-[0.2em]">Cổng quản trị viên</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white/80 text-xs font-medium uppercase mb-2 tracking-wider ml-1">
                            Email
                        </label>
                        <div className="relative group">
                            <input 
                                type="email" 
                                name="identifier"
                                value={credentials.identifier}
                                onChange={handleChange}
                                placeholder="admin@velvet.vn"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0058be] focus:bg-white/10 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/80 text-xs font-medium uppercase mb-2 tracking-wider ml-1">
                            Mật khẩu
                        </label>
                        <div className="relative group">
                            <input 
                                type="password" 
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0058be] focus:bg-white/10 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2">
                        <label className="flex items-center text-white/60 hover:text-white cursor-pointer transition-colors">
                            <input type="checkbox" className="mr-2 accent-[#0058be]" />
                            <span>Ghi nhớ tôi</span>
                        </label>
                        <a href="#" className="text-[#adc6ff] hover:text-white transition-colors">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl text-white font-semibold transform transition-all duration-300 active:scale-[0.98]
                                 bg-gradient-to-r from-[#0058be] to-[#2170e4] hover:shadow-[0_0_20px_rgba(0,88,190,0.4)] disabled:opacity-50"
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                    <p className="text-white/40 text-xs italic">
                        "Nghệ thuật là sự thăng hoa của cuộc sống"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
