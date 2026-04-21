import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import NewsStats from './components/NewsStats';
import NewsTable from './components/NewsTable';
import AddNewsModal from './components/AddNewsModal';
import API_URL from '../../config/api';

const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingNews, setEditingNews] = useState(null);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/news`, {
                credentials: 'include'
            });
            const data = await response.json();
            setNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleToggleStatus = async (newsId) => {
        const userStr = localStorage.getItem('user');
        let admin_id = null;
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/news/${newsId}/toggle-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id }),
                credentials: 'include'
            });
            if (response.ok) fetchNews();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingNews(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (newsId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            const userStr = localStorage.getItem('user');
            let admin_id = null;
            if (userStr) {
                try { admin_id = JSON.parse(userStr).id; } catch (e) {}
            }

            try {
                // Sending admin_id in both query and headers for maximum robustness
                const response = await fetch(`${API_URL}/api/admin/news/${newsId}?admin_id=${admin_id}`, {
                    method: 'DELETE',
                    headers: { 'X-Admin-ID': admin_id },
                    credentials: 'include'
                });
                if (response.ok) fetchNews();
            } catch (error) {
                console.error('Error deleting news:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingNews(null);
    };

    const filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-transparent">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">QUẢN LÝ TIN TỨC</h1>
                    <p className="text-slate-500 text-sm font-medium">Cập nhật và điều phối nội dung truyền thông cho Nhà hát kịch Việt Nam.</p>
                </div>
                <button 
                    onClick={() => { setEditingNews(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 active:scale-95"
                >
                    <FaPlus /> Thêm bài viết mới
                </button>
            </div>

            {/* Stats Overview */}
            <NewsStats />

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm tin tức theo tiêu đề hoặc nội dung..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-slate-400 shadow-sm"
                    />
                </div>
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <FaFilter /> Bộ lọc
                </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <NewsTable 
                    news={filteredNews} 
                    loading={loading} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            {/* Modal */}
            <AddNewsModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onRefresh={fetchNews}
                initialData={editingNews}
            />
        </div>
    );
};

export default NewsManagement;
