import React from 'react';

export default function ArticleHeader({ category, title, author, date, views }) {
    return (
        <header className="mb-10">
            <span className="inline-block px-3 py-1 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                {category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-900 leading-tight mb-6">
                {title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-600 border-y border-slate-200 dark:border-slate-800 py-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">person</span>
                    <span className="font-semibold items-center text-slate-700 dark:text-slate-600">{author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">calendar_today</span>
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">visibility</span>
                    <span>{views} lượt xem</span>
                </div>
            </div>
        </header>
    );
}