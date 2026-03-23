import React from 'react';
import ArtistCard from '../../artists/ArtistCard';

export default function PerformanceCast({ cast }) {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Dàn diễn viên
            </h3>
            <div className="flex flex-wrap gap-2">
                {cast.map((actor, index) => (
                    <ArtistCard
                        key={index}
                        artist={{
                            name: actor.name,
                            avatar: actor.avatar,
                            featured: actor.role
                        }}
                        variant="compact"
                    />
                ))}
            </div>
        </div>
    );
}