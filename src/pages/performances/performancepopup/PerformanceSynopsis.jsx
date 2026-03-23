import React from 'react';

export default function PerformanceSynopsis({ performance }) {
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-1 bg-primary rounded-full"></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    Nội dung vở diễn
                </h3>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 leading-relaxed">
                <p className="text-s md:text-base whitespace-pre-line">
                    {performance?.description || 'Đang cập nhật nội dung...'}
                </p>
            </div>
        </section>
    );
}