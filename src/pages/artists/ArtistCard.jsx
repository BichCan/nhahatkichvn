import React from 'react';

export default function ArtistCard({ artist, variant = 'default' }) {
    if (!artist) return null;

    // Compact variant cho performance cast
    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                {/* Avatar nhỏ */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                        src={artist?.avatar || 'https://via.placeholder.com/40x40?text=Artist'}
                        alt={artist?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40x40?text=Artist';
                        }}
                    />
                </div>
                
                {/* Thông tin */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-800 line-clamp-1">
                        {artist?.name}
                    </span>
                    {artist?.featured && (
                        <span className="text-[10px] text-primary">
                            {artist.featured}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // Default variant (cho trang nghệ sĩ)
    return (
        <div className="@container">
            <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                        src={artist?.avatar}
                        alt={artist?.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                        }}
                    />
                </div>

                <div className="flex w-full flex-col items-center justify-center gap-1 py-4 px-3 text-center min-h-[100px]">
                    {artist?.featured && (
                        <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                            {artist.featured}
                        </p>
                    )}
                    
                    <h3 className="text-gray-800 text-base font-semibold leading-tight line-clamp-2">
                        {artist?.name}
                    </h3>
                    
                    <div className="h-[2px] w-8 bg-primary rounded-full mt-1"></div>
                </div>
            </div>
        </div>
    );
}