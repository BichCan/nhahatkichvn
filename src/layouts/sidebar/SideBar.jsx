import React from 'react';
import { 
    FaChartPie, 
    FaTheaterMasks, 
    FaTicketAlt, 
    FaUsers, 
    FaNewspaper, 
    FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: <FaChartPie />, path: '/admin/dashboard' },
        { id: 'plays', label: 'Vở diễn', icon: <FaTheaterMasks />, path: '/admin/plays' },
        { id: 'artists', label: 'Nghệ sĩ', icon: <FaUsers />, path: '/admin/artists' },
        { id: 'news', label: 'Tin tức', icon: <FaNewspaper />, path: '/admin/news' },
        { id: 'bookings', label: 'Đơn hàng & Vé', icon: <FaTicketAlt />, path: '/admin/bookings' },
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLoginStatusChanged'));
        navigate('/admin'); // Redirect back to admin login
    };

    return (
        <div className="h-full w-full bg-[#1a1a1a] text-gray-300 flex flex-col shadow-2xl overflow-hidden border-r border-white/5">
            {/* Logo Section */}
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#800020] rounded-xl flex items-center justify-center shadow-lg shadow-[#800020]/20">
                    <FaTheaterMasks className="text-white text-xl" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tighter text-white">NHÀ HÁT KỊCH</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Việt Nam Admin</span>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
                {/* Main Menu */}
                <div>
                    <h3 className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">QUẢN LÝ CHÍNH</h3>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        active 
                                            ? 'bg-[#800020] text-white shadow-lg shadow-[#800020]/20' 
                                            : 'hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span className={`text-lg transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#800020]'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-[13px] font-semibold tracking-wide">
                                        {item.label}
                                    </span>
                                    {active && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-black/20 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500/70 hover:text-red-500 transition-colors text-xs font-semibold rounded-lg hover:bg-red-500/5 group"
                >
                    <FaSignOutAlt className="text-sm transition-transform group-hover:-translate-x-1" /> Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default SideBar;
