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

    // Tạo rating ngẫu nhiên (trong thực tế sẽ lấy từ API/database)
    const rating = performance.rating || (Math.random() * 2 + 3).toFixed(1); // Random từ 3.0 - 5.0
    const ratingCount = performance.ratingCount || Math.floor(Math.random() * 1000) + 100;

    // Hàm hiển thị sao
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                // Sao đầy
                stars.push(
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                // Nửa sao
                stars.push(
                    <span key={i} className="text-yellow-400 text-sm">⯨</span>
                );
            } else {
                // Sao rỗng
                stars.push(
                    <span key={i} className="text-gray-300 text-sm">★</span>
                );
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

                {/* Rating Section - Căn giữa */}
                <div className="mt-auto w-full">
                    <div className="flex items-center justify-center gap-1">
                        {renderStars()}
                        <span className="text-xs font-bold text-gray-700 ml-1">{rating}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                        {ratingCount.toLocaleString()} lượt đánh giá
                    </p>
                </div>
            </div>
        </div>
    );
}