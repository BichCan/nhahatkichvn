import React, { useState, useEffect } from 'react';

export default function PerformanceCardRating({ performance }) {
    // STATE - Theo dõi kích thước màn hình
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Kiểm tra nếu không có dữ liệu
    if (!performance) return null;

    // Lấy rating thực từ DB (backend đã tính sẵn avg từ bảng ratings)
    const rating = performance.rating > 0 ? Number(performance.rating).toFixed(1) : null;
    const ratingCount = performance.ratingCount || 0;

    // Hàm hiển thị sao
    const renderStars = (score) => {
        if (!score) return null;
        const stars = [];
        const fullStars = Math.floor(score);
        const hasHalfStar = score - fullStars >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i} className="text-yellow-400 text-sm">★</span>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<span key={i} className="text-yellow-400 text-sm">⯨</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300 text-sm">★</span>);
            }
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col cursor-pointer transform hover:scale-[1.02] transition-transform duration-300">
            {/* Image Section - Ở trên cùng */}
            <div className="w-full h-48 md:h-56 overflow-hidden flex-shrink-0">
                <img
                    src={performance.src || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={performance.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                />
            </div>

            {/* Content Section - Ở dưới, căn giữa */}
            <div className="p-4 flex flex-col items-center text-center flex-1">
                {/* Title */}
                <h2 className="text-base md:text-lg font-bold leading-tight mb-2 line-clamp-2 text-gray-900 max-w-full">
                    {performance.name}
                </h2>

                {/* Duration and Genre */}
                <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-3">
                    <span className="flex items-center gap-0.5 whitespace-nowrap">
                        <span className="material-symbols-outlined text-xs text-gray-400">schedule</span>
                        <span>{performance.duration}</span>
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0"></span>
                    <span className="truncate">{performance.type}</span>
                </div>

                {/* Rating Section */}
                <div className="mt-auto w-full">
                    {rating ? (
                        <>
                            <div className="flex items-center justify-center gap-1">
                                {renderStars(rating)}
                                <span className="text-xs font-bold text-gray-700 ml-1">{rating}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                                {ratingCount > 0 ? `${ratingCount.toLocaleString()} lượt đánh giá` : ''}
                            </p>
                        </>
                    ) : (
                        <p className="text-[10px] text-gray-400 italic text-center">Chưa có đánh giá</p>
                    )}
                </div>
            </div>
        </div>
    );
}