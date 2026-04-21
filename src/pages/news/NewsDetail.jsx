import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleHeader from './components/ArticleHeader';
import ArticleImage from './components/ArticleImage';
import ArticleContent from './components/ArticleContent';
import ArticleNavigation from './components/ArticleNavigation';
import TableOfContents from './components/TableOfContents';
import RelatedPosts from './components/RelatedPosts';
import API_URL from '../../config/api';

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/news`)
            .then(res => res.json())
            .then(data => {
                // Ensure sorted by newest first
                const sortedData = [...data].sort((a, b) => 
                    new Date(b.created_at) - new Date(a.created_at)
                );
                
                const currentIndex = sortedData.findIndex(item => item.id === parseInt(id));
                const found = sortedData[currentIndex];
                
                if (found) {
                    // Standardize content
                    if (typeof found.content === 'string') {
                        try {
                            const parsed = JSON.parse(found.content);
                            found.content = Array.isArray(parsed) ? parsed : [{ type: 'paragraph', text: found.content }];
                        } catch (e) {
                            found.content = [{ type: 'paragraph', text: found.content }];
                        }
                    }
                    
                    found.image = found.src;
                    found.date = new Date(found.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    found.category = "Tin tức & Sự kiện";
                    found.author = found.author || "Nhà hát kịch Việt Nam";

                    // Navigation logic: in DESC array:
                    // index - 1 is newer (Next)
                    // index + 1 is older (Previous)
                    const nextPost = currentIndex > 0 ? sortedData[currentIndex - 1] : null;
                    const prevPost = currentIndex < sortedData.length - 1 ? sortedData[currentIndex + 1] : null;
                    
                    // Related posts: pick 3 others
                    const relatedPosts = sortedData
                        .filter(item => item.id !== found.id)
                        .slice(0, 3);
                        
                    setNews({
                        ...found,
                        nextPost,
                        prevPost,
                        relatedPosts
                    });
                }
                
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching news:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Đang tải câu chuyện...</p>
            </div>
        </div>
    );

    if (!news) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h1 className="font-['Newsreader'] text-4xl mb-4">Không tìm thấy bài viết</h1>
                <p className="text-slate-500">Nội dung này có thể đã được gỡ bỏ hoặc chưa được xuất bản.</p>
            </div>
        </div>
    );

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white font-['Roboto']">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
                <article className="lg:col-span-8">
                    <ArticleHeader 
                        category={news.category}
                        title={news.title}
                        author={news.author}
                        date={news.date}
                        views={news.views || '1,240'}
                    />
                    
                    <ArticleImage 
                        src={news.image}
                        caption={news.imageCaption}
                    />
                    
                    <ArticleContent content={news.content} />
                    
                    <div className="mt-16">
                        <ArticleNavigation 
                            prevPost={news.prevPost}
                            nextPost={news.nextPost}
                        />
                    </div>
                </article>
                
                <aside className="lg:col-span-4 space-y-12">
                    <TableOfContents content={news.content} />
                    <RelatedPosts relatedPosts={news.relatedPosts} />
                </aside>
            </div>
        </main>
    );
}