import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import SideBar from './sidebar/SideBar';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import Login from '../adminpages/login/Login'; // Import the Admin Login component

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user && user.role === 'admin') {
                        setIsAuthenticated(true);
                        // Redirect from base /admin or /admin/ to dashboard if authenticated
                        if (location.pathname === '/admin' || location.pathname === '/admin/') {
                            navigate('/admin/dashboard');
                        }
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (e) {
                    console.error("Error parsing user data from localStorage", e);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
        
        // Listen for login status changes
        window.addEventListener('userLoginStatusChanged', checkAuth);
        return () => window.removeEventListener('userLoginStatusChanged', checkAuth);
    }, [location.pathname, navigate]);

    if (loading) return null; // Or a loading spinner

    // If not authenticated, only show the Login page
    if (!isAuthenticated) {
        return <Login />;
    }

    // Full Admin layout for authenticated admins
    return (
        <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
            {/* Desktop Sidebar (Permanent) */}
            <div className="hidden lg:block w-[280px] h-full shrink-0">
                <SideBar />
            </div>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`fixed inset-0 z-[150] lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                
                {/* Drawer Content */}
                <div className={`absolute top-0 left-0 h-full w-[280px] bg-[#1a1a1a] transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SideBar />
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 -right-12 p-2 bg-white rounded-lg text-gray-900 shadow-xl"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header Section */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-10 lg:h-20 lg:px-10">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600 transition-colors"
                        >
                            <HiMenuAlt2 className="text-2xl" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 lg:text-xl">Hệ thống quản trị</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Nhà Hát Kịch Việt Nam</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-right text-right">
                            <span className="text-xs font-bold text-gray-900">Admin User</span>
                            <span className="text-[10px] text-green-500 font-bold uppercase">Trực Tuyến</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#800020] to-[#b01e40] border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Content Outlet */}
                <main className="flex-1 overflow-y-auto bg-[#f8f9fa] p-6 lg:p-10 relative">
                    <Outlet />
                    
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10 opacity-40 -translate-x-1/2 translate-y-1/2" />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
