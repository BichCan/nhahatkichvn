import React from 'react';
import newsData from '../../data/NewsData';
import NewsBox from './components/NewsBox';

export default function NewsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2">
                    TIN TỨC & SỰ KIỆN
                </h1>
                <div className="w-20 h-1 bg-[#8B0000] rounded-full"></div>
                <p className="text-gray-600 mt-4">
                    Cập nhật những tin tức mới nhất về các vở diễn và hoạt động của nhà hát
                </p>
            </div>

            {/* Grid: 1 cột mobile, 2 cột tablet, 3 cột desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {newsData.map((item) => (
                    <NewsBox key={item.id} news={item} />
                ))}
            </div>
        </div>
    );
}