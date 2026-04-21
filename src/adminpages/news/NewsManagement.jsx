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

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/news`);
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

    const filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">QUẢN LÝ TIN TỨC</h1>
                    <p className="text-gray-500 text-sm font-medium">Cập nhật và điều phối nội dung truyền thông cho Nhà hát kịch Việt Nam.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
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
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm tin tức theo tiêu đề hoặc nội dung..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                    />
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                    <FaFilter /> Bộ lọc
                </button>
            </div>

            {/* List Table */}
            <NewsTable news={filteredNews} loading={loading} />

            {/* Modal */}
            <AddNewsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchNews}
            />
        </div>
    );
};

export default NewsManagement;
