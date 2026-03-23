import React from 'react';
import { ClockIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline';

export default function PerformanceInfo({ performance }) {
    return (
        <header>
            <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-100  text-gray-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {performance?.type || 'Kịch'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {performance?.status || 'Sắp diễn'}
                </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {performance?.name}
            </h2>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-800">{performance?.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-800">{performance?.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-800">{performance?.director || 'Đang cập nhật'}</span>
                </div>
            </div>
        </header>
    );
}