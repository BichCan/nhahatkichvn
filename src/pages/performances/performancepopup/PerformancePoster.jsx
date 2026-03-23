import React from 'react';

export default function PerformancePoster({ performance }) {
    return (
        <div className=" top-8 w-3/5 mx-auto"> {/* w-3/5 = 60% */}
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-200 aspect-[2/3]">
                <img
                    src={performance?.src || 'https://via.placeholder.com/400x600?text=No+Image'}
                    alt={performance?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                    }}
                />
            </div>
        </div>
    );
}