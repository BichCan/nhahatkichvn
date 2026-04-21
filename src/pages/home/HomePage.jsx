import React, { useState, useEffect } from "react";
import Banner from "./Banner";
import PerformanceCard from "../performances/PerformanceCard";
import performancesDataFallback from "../../data/PerformancesData";

export default function HomePage() {
    const [featuredPerformances, setFeaturedPerformances] = useState([]);

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                // Try fetching from API first
                const response = await fetch("http://127.0.0.1:5000/api/performances");
                if (!response.ok) throw new Error("API not available");
                const data = await response.json();
                
                // Sort by rating descending and take top 3
                const sorted = data
                    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
                    .slice(0, 3);
                setFeaturedPerformances(sorted);
            } catch (error) {
                console.warn("API fetch failed, using local data backup:", error);
                // Fallback to local data
                const sortedFallback = [...performancesDataFallback]
                    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
                    .slice(0, 3);
                setFeaturedPerformances(sortedFallback);
            }
        };

        fetchPerformances();
    }, []);

    return (
        <div className="w-full min-h-screen bg-white">
            <Banner />

            {/* Featured Performances Section */}
            <section className="bg-[#FFF9F8] py-16 md:py-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {/* Header Layout */}
                    <div className="mb-16">
                        <p className="text-[#800020] text-xs md:text-sm font-bold tracking-[0.25em] uppercase mb-4 opacity-80">
                            VỞ DIỄN NỔI BẬT
                        </p>
                        <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#2D2D2D] leading-[1.2] max-w-3xl">
                            Mỗi tuần một câu chuyện ấm áp, <br className="hidden md:block" />
                            <span className="text-[#9E6B65] italic opacity-90">
                                mỗi tuần một câu chuyện tình.
                            </span>
                        </h2>
                    </div>

                    {/* Performances Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                        {featuredPerformances.map((performance) => (
                            <div key={performance.id} className="h-full">
                                <PerformanceCard performance={performance} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="bg-[#FFF9F8] pb-16 md:pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left Side: Content */}
                    <div className="flex-1 text-left order-2 lg:order-1">
                        <p className="text-[#800020] text-xs md:text-sm font-bold tracking-[0.25em] uppercase mb-6 opacity-80">
                            GIÁ TRỊ CỐT LÕI
                        </p>
                        <h2 className="text-[2.2rem] md:text-[2.8rem] font-bold text-[#2D2D2D] leading-[1.3] mb-8">
                            72 năm tự hào kiến tạo <br />
                            dòng chảy nghệ thuật kịch nói.
                        </h2>
                        <p className="text-[#555555] text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                            Nhà Hát Kịch Việt Nam là cái nôi của nhiều thế hệ nghệ sĩ tài hoa. Chúng tôi không ngừng sáng tạo để mang đến những tác phẩm phản ánh chân thực nhịp sống, giữ gìn bản sắc văn hóa dân tộc trong từng hơi thở sân khấu hiện đại.
                        </p>
                        
                        <div className="flex items-center gap-4 group cursor-pointer w-fit">
                            <div className="w-10 h-[1.5px] bg-[#800020] opacity-40 group-hover:w-16 transition-all duration-300"></div>
                            <span className="text-[#800020] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                                DI SẢN & ĐỔI MỚI
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <div className="flex-1 w-full lg:w-auto order-1 lg:order-2">
                        <div className="relative group overflow-hidden rounded-lg shadow-xl">
                            <img 
                                src="/home_core_values.png" 
                                alt="Nhà Hát Kịch Việt Nam facade" 
                                className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}