import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaUsers } from 'react-icons/fa';
import ArtistList from './components/ArtistList';
import AddArtistModal from './components/AddArtistModal';
import API_URL from '../../config/api';

const ArtistManagement = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/artists`);
            const data = await response.json();
            setArtists(data);
        } catch (error) {
            console.error('Error fetching artists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const filteredArtists = artists.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.role_type && item.role_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">QUẢN LÝ NGHỆ SĨ</h1>
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200 text-red-600 font-bold">
                            <FaUsers /> {artists.length} NGHỆ SĨ
                        </span>
                        <span>Duy trì và phát triển đội ngũ nòng cốt của Nhà hát kịch Việt Nam.</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap"
                >
                    <FaPlus /> Thêm nghệ sĩ mới
                </button>
            </div>

            {/* Quick Stats Placeholder or Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên nghệ sĩ hoặc vai trò..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none focus:border-red-600/50 shadow-sm focus:shadow-md transition-all placeholder:text-gray-400"
                    />
                </div>
                <button className="px-6 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                    <FaFilter /> Phân loại
                </button>
            </div>

            {/* Content Section */}
            <ArtistList artists={filteredArtists} loading={loading} />

            {/* Footer Attribution (Matched with design screenshot) */}
            <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-center text-center">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                    VELVET ARCHIVE © 2024 • THEATER CURATION SYSTEM
                </p>
            </div>

            {/* Modals */}
            <AddArtistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchArtists}
            />
        </div>
    );
};

export default ArtistManagement;
