import { FaUser } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = useCallback(async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/check-session', { credentials: 'include' });
            const data = await response.json();
            if (data.logged_in) {
                const userData = { ...data.user, id: data.user.id };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        } catch (err) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    setUser(null);
                }
            }
        }
    }, []);

    // Check auth on mount, when location changes, and when menu opens
    useEffect(() => {
        checkAuth();
    }, [checkAuth, location.pathname]);

    useEffect(() => {
        if (open) {
            checkAuth();
        }
    }, [open, checkAuth]);

    // Listen for storage events (login from other windows/tabs or same tab)
    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        // Custom event for same-tab updates
        window.addEventListener('userLoginStatusChanged', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLoginStatusChanged', handleStorageChange);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://127.0.0.1:5000/api/logout', { 
                method: 'POST',
                credentials: 'include' 
            });
            localStorage.removeItem('user');
            setUser(null);
            setOpen(false);
            window.dispatchEvent(new Event('userLoginStatusChanged'));
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
            localStorage.removeItem('user');
            setUser(null);
            setOpen(false);
            window.dispatchEvent(new Event('userLoginStatusChanged'));
            navigate('/login');
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setOpen(!open)} 
                className="p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center gap-2"
                title={user ? `Xin chào, ${user.full_name}` : "Tài khoản"}
            >
                <FaUser className={user ? "text-yellow-400" : "text-white"} />
            </button>
            
            {open && (
                <div className="absolute overflow-hidden right-0 mt-2 w-60 bg-[#1a1a1a] text-white rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 border border-gray-800">
                    {!user ? (
                        <>
                            <div className="px-5 py-4 border-b border-gray-800 bg-[#111]">
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Tài khoản</p>
                            </div>
                            <button 
                                onClick={() => { setOpen(false); navigate('/login'); }} 
                                className="w-full text-left px-5 py-4 hover:bg-gray-800 transition-all text-sm font-semibold border-b border-gray-800/30"
                            >
                                Đăng nhập
                            </button>
                            <button 
                                onClick={() => { setOpen(false); navigate('/register'); }} 
                                className="w-full text-left px-5 py-4 hover:bg-gray-800 transition-all text-sm font-semibold text-yellow-500"
                            >
                                Đăng ký
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="px-5 py-4 border-b border-gray-800 bg-gradient-to-r from-[#222] to-[#111]">
                                <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-black mb-1">Xin chào!</p>
                                <p className="text-sm font-bold text-yellow-500 truncate drop-shadow-sm">{user.full_name}</p>
                            </div>
                            <button 
                                onClick={() => { setOpen(false); navigate('/thong-tin-dat-ve'); }} 
                                className="w-full text-left px-5 py-4 hover:bg-gray-800 transition-all text-sm group"
                            >
                                <span className="group-hover:translate-x-1 inline-block transition-transform">Thông tin đặt vé</span>
                            </button>
                            <button 
                                onClick={() => { setOpen(false); navigate('/profile'); }} 
                                className="w-full text-left px-5 py-4 hover:bg-gray-800 transition-all text-sm group"
                            >
                                <span className="group-hover:translate-x-1 inline-block transition-transform">Thông tin cá nhân</span>
                            </button>
                            <div className="border-t border-gray-800 mt-2 bg-[#111]">
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full text-left px-5 py-4 hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-all text-sm font-black tracking-widest uppercase"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}