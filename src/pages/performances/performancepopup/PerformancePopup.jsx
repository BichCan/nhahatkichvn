import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PerformancePoster from './PerformancePoster';
import PerformanceInfo from './PerformanceInfo';
import PerformanceSynopsis from './PerformanceSynopsis';
import PerformanceCast from './PerformanceCast';
import PerformanceCreativeTeam from './PerformanceCreativeTeam';
import PerformanceTechTeam from './PerformanceTechTeam';
import PerformanceActions from './PerformanceActions';

export default function PerformancePopup({ performance, onClose }) {
    if (!performance) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Popup content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    <div className="flex flex-col lg:flex-row gap-8 p-8 text-gray-900">
                        {/* Left Column: Poster */}
                        <div className="lg:w-1/3">
                            <PerformancePoster performance={performance} />
                            <PerformanceActions performance={performance} />
                        </div>

                        {/* Right Column: Content */}
                        <div className="lg:w-2/3 space-y-8">
                            <PerformanceInfo performance={performance} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <PerformanceSynopsis performance={performance} />
                                    <PerformanceCast performance={performance} />
                                </div>
                                
                                <div className="space-y-8">
                                    <PerformanceCreativeTeam performance={performance} />
                                    <PerformanceTechTeam performance={performance} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}