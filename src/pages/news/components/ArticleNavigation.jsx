import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleNavigation({ prevPost, nextPost }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-8 border-t border-slate-200 dark:border-slate-800 gap-4">
            {prevPost ? (
                <Link to={`/tin-tuc/${prevPost.slug}`} className="group flex items-center gap-4 max-w-xs transition-all">
                    <div className="flex items-center justify-center size-10 rounded-full border border-slate-300 dark:border-slate-700 group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase tracking-widest text-slate-800 font-bold">Bài trước</span>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-800 line-clamp-1">{prevPost.title}</p>
                    </div>
                </Link>
            ) : <div />}
            
            {nextPost ? (
                <Link to={`/tin-tuc/${nextPost.slug}`} className="group flex items-center text-right gap-4 max-w-xs transition-all">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-slate-800 font-bold">Bài sau</span>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-800 line-clamp-1">{nextPost.title}</p>
                    </div>
                    <div className="flex items-center justify-center size-10 rounded-full border border-slate-800 dark:border-slate-700 group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                </Link>
            ) : <div />}
        </div>
    );
}