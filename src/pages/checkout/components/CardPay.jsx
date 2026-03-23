import React from 'react';

export default function CardPay({ name, description, icon, onChoose, isSelected }) {
    return (
        <div
            onClick={onChoose}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                    ? 'border-[#5a1a1a] bg-[#5a1a1a]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
        >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${
                isSelected ? 'bg-[#5a1a1a]/10' : 'bg-gray-100'
            }`}>
                {icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>

            {/* Radio */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? 'border-[#5a1a1a]' : 'border-gray-300'
            }`}>
                {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5a1a1a]" />
                )}
            </div>
        </div>
    );
}
