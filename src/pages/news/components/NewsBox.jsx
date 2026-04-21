import React from 'react';
import { Link } from 'react-router-dom';

const getExcerpt = (content) => {
    if (!content) return "";
    
    // If it's a JSON array (standardized format)
    if (Array.isArray(content)) {
        const textBlocks = content.filter(b => b.type === 'paragraph' || b.type === 'heading').map(b => b.text);
        return textBlocks.join(" ").substring(0, 120) + "...";
    }
    
    // If it's a string from DB (could contain JSON-like artifacts or just plain text)
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return getExcerpt(parsed);
    } catch (e) {}
    
    // Plain string: clean up simple JSON tags if someone entered them manually
    return content.replace(/\[\{.*?\}\]/g, "").substring(0, 120) + "...";
};

export default function NewsBox({ news }) {
    if (!news) return null;
    
    const excerpt = getExcerpt(news.content);
    const date = news.created_at ? new Date(news.created_at).toLocaleDateString('vi-VN') : "Vừa xong";
    
    return (
        <Link to={`/tin-tuc/${news.id}`} className="group block relative h-full">
            <article className="bg-white h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(139,0,0,0.15)] border border-slate-100">
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                        alt={news.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        src={news.src}
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#8B0000] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                            Tin mới
                        </span>
                    </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow relative">
                    {/* Metadata Header */}
                    <div className="flex items-center gap-4 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{news.author || "Nhà hát Kịch VN"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                            <svg className="w-3.5 h-3.5 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{date}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="font-['Newsreader'] text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-[#8B0000] transition-colors line-clamp-2">
                        {news.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-['Roboto'] flex-grow">
                        {excerpt}
                    </p>
                    
                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-1 group-hover:text-[#8B0000] transition-colors">
                            Xem chi tiết
                            <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                        
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000]/20"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000]/40"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000]"></div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}