import React from 'react';
import { useParams } from 'react-router-dom';
import newsData from '../../data/NewsData';
import ArticleHeader from './components/ArticleHeader';
import ArticleImage from './components/ArticleImage';
import ArticleContent from './components/ArticleContent';
import ArticleNavigation from './components/ArticleNavigation';
import TableOfContents from './components/TableOfContents';
import RelatedPosts from './components/RelatedPosts';

export default function NewsDetail() {
    const { slug } = useParams();
    const news = newsData.find(item => item.slug === slug);
    
    if (!news) return <div>Không tìm thấy bài viết</div>;
    
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