import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedPosts({ relatedPosts }) {
    // Disable for now since relatedPosts requires additional API logic
    // const posts = relatedPosts?.map(id => newsData.find(news => news.id === id)).filter(Boolean) || [];
    const posts = [];
    
    if (posts.length === 0) return null;
    
    return (
        <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                Bài viết liên quan
            </h4>
            <div className="space-y-6">
                {posts.slice(0, 3).map(post => (
                    <Link key={post.id} to={`/tin-tuc/${post.slug}`} className="group flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                            <img 
                                src={post.image} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/200x200?text=News';
                                }}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                                {post.category}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                {post.title}
                            </h5>
                            <span className="text-xs text-slate-500 mt-2">{post.date}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}