import React from 'react';

export default function ArticleImage({ src, caption }) {
    return (
        <figure className="mb-10 group">
            <div className="overflow-hidden rounded-xl bg-slate-200 aspect-[16/9]">
                <img 
                    src={src} 
                    alt={caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/1200x630?text=No+Image';
                    }}
                />
            </div>
            {caption && (
                <figcaption className="mt-4 text-center italic text-slate-600 dark:text-slate-500 text-sm border-l-4 border-primary pl-4 py-1">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}