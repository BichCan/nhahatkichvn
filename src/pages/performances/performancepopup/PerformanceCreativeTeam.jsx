import React from 'react';

export default function PerformanceCreativeTeam({ performance }) {
    const team = [
        { label: 'Tác giả', value: performance?.author },
        { label: 'Đạo diễn', value: performance?.director },
        { label: 'Họa sĩ', value: performance?.artist },
        { label: 'Âm nhạc', value: performance?.musician },
        { label: 'Biên đạo', value: performance?.choreographer },
    ].filter(item => item.value);

    if (team.length === 0) return null;

    return (
        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/20">
            <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">star</span>
                Ê-kíp sáng tạo
            </h4>
            <div className="space-y-3">
                {team.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b border-primary/10 pb-2">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}