import React from 'react';
import { SpeakerWaveIcon, LightBulbIcon, WrenchIcon } from '@heroicons/react/24/outline';

export default function PerformanceTechTeam({ performance }) {
    const techItems = [
        { icon: SpeakerWaveIcon, label: 'Âm thanh', value: performance?.sound || 'Tổ âm thanh NHKVN' },
        { icon: LightBulbIcon, label: 'Ánh sáng', value: performance?.lighting || 'Tổ ánh sáng NHKVN' },
        { icon: WrenchIcon, label: 'Phục trang', value: performance?.costume || 'Xưởng phục trang NHKVN' },
    ];

    return (
        <div className="bg-orange-100 p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">
                Kỹ thuật
            </h4>
            <div className="space-y-3">
                {techItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                        <item.icon className="w-5 h-5 text-primary text-orange-600  " />
                        <div>
                            <p className="text-sm  font-bold text-gray-500">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}