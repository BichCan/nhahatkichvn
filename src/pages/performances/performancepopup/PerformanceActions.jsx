import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function PerformanceActions({ performance }) {
    return (
        <div className="mt-6 space-y-4">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30">
                <span className="material-symbols-outlined ">confirmation_number</span>
                ĐẶT VÉ NGAY
            </button>

            <div className="bg-slate-800 text-white border border-gray-200 text-gray-900 p-4 rounded-xl shadow-sm">
                <h4 className="text-white font-bold uppercase tracking-widest  mb-3">
                    Suất diễn gần nhất
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6 text-primary" />
                            <div>
                                <p className="text-s font-bold">20:00 - Thứ Bảy</p>
                                <p className="text-xs ">25 Tháng 5, 2024</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-primary text-sm">chevron_right</span>
                    </div>
                </div>
            </div>
        </div>
    );
}