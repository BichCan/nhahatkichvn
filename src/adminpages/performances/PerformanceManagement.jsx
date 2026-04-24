import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter, FaTheaterMasks } from 'react-icons/fa';
import PerformanceList from './components/PerformanceList';
import API_URL from '../../config/api';

const PerformanceManagement = () => {
    const navigate = useNavigate();
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPerformances = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/performances`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setPerformances(data.performances);
            }
        } catch (error) {
            console.error('Error fetching performances:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformances();
    }, []);

    const handleDeletePerformance = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa vở diễn này? Tất cả suất diễn liên quan cũng sẽ bị xóa.')) return;
        
        const userStr = localStorage.getItem('user');
        let admin_id = '1';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }
        
        try {
            const response = await fetch(`${API_URL}/api/admin/performances/${id}?admin_id=${admin_id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                fetchPerformances();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting performance:', error);
            alert('Lỗi khi xóa vở diễn.');
        }
    };

    const handleEditPerformance = (perf) => {
        navigate(`/admin/performances/update/${perf.id}`);
    };

    const handleAddNew = () => {
        navigate('/admin/performances/create');
    };

    const filteredPerformances = performances.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">QUẢN LÝ VỞ DIỄN</h1>
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-lg border border-gray-200 text-red-600 font-bold">
                            <FaTheaterMasks /> {performances.length} VỞ DIỄN
                        </span>
                        <span>Quản lý danh sách các vở diễn và lịch trình biểu diễn của Nhà hát.</span>
                    </div>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap"
                >
                    <FaPlus /> Thêm vở diễn mới
                </button>
            </div>

            {/* Quick Stats Placeholder or Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên vở diễn, thể loại..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none focus:border-red-600/50 shadow-sm focus:shadow-md transition-all placeholder:text-gray-400"
                    />
                </div>
                <button className="px-6 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                    <FaFilter /> Bộ lọc
                </button>
            </div>

            {/* Content Section */}
            <PerformanceList 
                performances={filteredPerformances} 
                loading={loading} 
                onEdit={handleEditPerformance}
                onDelete={handleDeletePerformance}
            />

            {/* Footer Attribution */}
            <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-center text-center">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                    VELVET ARCHIVE © 2024 • THEATER CURATION SYSTEM
                </p>
            </div>
        </div>
    );
};

export default PerformanceManagement;
