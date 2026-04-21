import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedPosts({ relatedPosts }) {
    const posts = Array.isArray(relatedPosts) ? relatedPosts : [];
    
    if (posts.length === 0) return null;
    
    return (
        <div>
            <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8B0000]">auto_awesome</span>
                Bài viết liên quan
            </h4>
            <div className="space-y-6">
                {posts.slice(0, 3).map(post => (
                    <Link key={post.id} to={`/tin-tuc/${post.id}`} className="group flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                            <img 
                                src={post.src} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/200x200?text=News';
                                }}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B0000] mb-1">
                                {post.category || "Tin tức"}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#8B0000] transition-colors leading-snug line-clamp-2">
                                {post.title}
                            </h5>
                            <span className="text-xs text-slate-500 mt-2">
                                {new Date(post.created_at).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}