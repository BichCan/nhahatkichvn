import React from 'react';
import { Link } from 'react-router-dom';
export default function NewsBox({ news }) {
    if (!news) return null;
    
    return (
        <Link to={`/tin-tuc/${news.id}`} className="block group">
            <article className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                {/* Hero Image Section */}
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                    <img 
                        alt={news.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        src={news.src}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                    {/* News Title */}
                    <h2 className="font-['Georgia'] tracking-[0.025em] text-lg font-bold text-[#8B0000] uppercase line-clamp-2 mb-2 min-h-[3.5rem] group-hover:text-[#a00000] transition-colors">
                        {news.title}
                    </h2>
                    
                    {/* News Excerpt */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                        {news.excerpt || news.content?.[0]?.text || "..."}
                    </p>
                    
                    {/* Footer with date */}
                    <footer className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{news.author || "NHK"}</span>
                            <time className="font-medium italic">
                                {news.date}
                            </time>
                        </div>
                    </footer>
                </div>
            </article>
        </Link>
    );
}