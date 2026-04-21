import React from 'react';
import { FaEdit, FaTrash, FaStar, FaInfoCircle, FaUser } from 'react-icons/fa';

const ArtistList = ({ artists, loading }) => {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
                <div key={artist.id} className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 shadow-xl hover:shadow-red-600/5">
                    {/* Header Image/Avatar */}
                    <div className="relative h-48 bg-gray-800">
                        {artist.avatar ? (
                            <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gradient-to-br from-gray-800 to-gray-900">
                                <FaUser size={48} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80"></div>
                        
                        {/* Overlay Actions */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-red-600 transition-colors">
                                <FaEdit size={12} />
                            </button>
                            <button className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-red-600 transition-colors">
                                <FaTrash size={12} />
                            </button>
                        </div>

                        <div className="absolute bottom-4 left-6">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white mb-2 inline-block">
                                {artist.role_type || 'Nghệ sĩ'}
                            </span>
                            <h3 className="text-xl font-bold text-white tracking-tight">{artist.name}</h3>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[60px]">
                            {artist.bio || 'Chưa có thông tin giới thiệu cho nghệ sĩ này.'}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                            </div>
                            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1">
                                <FaInfoCircle /> Chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            {artists.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-gray-500 font-medium italic">Không tìm thấy nghệ sĩ nào.</p>
                </div>
            )}
        </div>
    );
};

export default ArtistList;
