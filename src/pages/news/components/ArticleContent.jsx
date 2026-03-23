import React from 'react';

export default function ArticleContent({ content }) {
    const renderContent = (block, index) => {
        switch (block.type) {
            case 'paragraph':
                return <p key={index} className="mb-6 text-lg text-slate-900 dark:text-slate-900 leading-relaxed">{block.text}</p>;
            
            case 'heading':
                const HeadingTag = `h${block.level}`;
                return (
                    <HeadingTag key={index} className={`text-${block.level === 2 ? '3xl' : '2xl'} font-bold text-slate-900 dark:text-slate-900 mt-10 mb-4`}>
                        {block.text}
                    </HeadingTag>
                );
            
            case 'list':
                return (
                    <ul key={index} className="space-y-4 list-none mb-8">
                        {block.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                <span className="text-slate-900 dark:text-slate-200">{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            
            case 'quote':
                return (
                    <blockquote key={index} className="my-8 p-8 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                        <p className="italic text-xl text-slate-600 dark:text-slate-800 mb-4">"{block.text}"</p>
                        {block.author && (
                            <cite className="block font-bold text-primary">— {block.author}</cite>
                        )}
                    </blockquote>
                );
            
            case 'image':
                return (
                    <figure key={index} className="my-8">
                        <img src={block.src} alt={block.caption} className="w-full rounded-lg" />
                        {block.caption && (
                            <figcaption className="mt-2 text-sm text-slate-500 text-center">{block.caption}</figcaption>
                        )}
                    </figure>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="article-content mb-12">
            {content.map((block, index) => renderContent(block, index))}
        </div>
    );
}