import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleHeader from './components/ArticleHeader';
import ArticleImage from './components/ArticleImage';
import ArticleContent from './components/ArticleContent';
import ArticleNavigation from './components/ArticleNavigation';
import TableOfContents from './components/TableOfContents';
import RelatedPosts from './components/RelatedPosts';

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/news')
            .then(res => res.json())
            .then(data => {
                const found = data.find(item => item.id === parseInt(id));
                setNews(found);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching news:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Đang tải...</div>;
    if (!news) return <div>Không tìm thấy bài viết</div>;

    // Use default values for rendering since backend only passed src and content
    news.image = news.src;

    
    return (
        <main className="container mx-auto px-4 md:px-10 lg:px-20 py-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                    
                    <ArticleNavigation 
                        prevPost={news.prevPost}
                        nextPost={news.nextPost}
                    />
                </article>
                
                <aside className="lg:col-span-4 space-y-10">
                    <TableOfContents content={news.content} />
                    <RelatedPosts relatedPosts={news.relatedPosts} />
                </aside>
            </div>
        </main>
    );
}