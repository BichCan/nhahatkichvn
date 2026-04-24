import React, { useState, useEffect } from 'react';
import NewsBox from './components/NewsBox';

export default function NewsPage() {
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/news')
            .then(res => res.json())
            .then(data => setNewsData(data))
            .catch(err => console.error("Error fetching news:", err));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            {/* Header */}
            <div className="max-w-3xl mb-16 md:mb-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-[1px] w-12 bg-[#8B0000]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B0000]">Phòng truyền thông</span>
                </div>
                <h1 className="font-['Newsreader'] text-5xl md:text-7xl font-bold text-slate-950 leading-[0.95] tracking-tight mb-8">
                    Tin tức & <br/>
                    <span className="text-[#8B0000] italic">Sự kiện</span>
                </h1>
                <p className="text-xl text-slate-500 font-light leading-relaxed font-['Roboto'] border-l-2 border-slate-100 pl-8">
                    Nơi lưu giữ những khoảnh khắc, câu chuyện hậu trường và thông báo quan trọng nhất từ Nhà hát kịch Việt Nam.
                </p>
            </div>

            {/* Grid: 1 cột mobile, 2 cột tablet, 3 cột desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {newsData.filter(item => item.is_published).map((item) => (
                    <NewsBox key={item.id} news={item} />
                ))}
            </div>
        </div>
    );
}