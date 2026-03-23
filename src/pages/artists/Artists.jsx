import React from 'react';
import artistsData from '../../data/ArtistsData';
import ArtistCard from './ArtistCard';

export default function ArtistsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    NGHỆ SĨ
                </h1>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
                <p className="text-gray-600 mt-4">
                    Đội ngũ nghệ sĩ tài năng của Nhà hát Kịch Việt Nam
                </p>
            </div>

            {/* Grid Artists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {artistsData.map((artist) => (
                    <ArtistCard 
                        key={artist.id} 
                        artist={artist}
                    />
                ))}
            </div>
        </div>
    );
}