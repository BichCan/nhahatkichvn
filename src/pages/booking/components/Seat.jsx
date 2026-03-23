import React from 'react';

export default function Seat({ row, number, type, isSelected, isOccupied, onClick }) {
    const getSeatClass = () => {
        if (isOccupied) {
            return 'bg-gray-400 text-white cursor-not-allowed opacity-50';
        }
        if (isSelected) {
            return 'bg-green-500 text-white hover:bg-green-600';
        }
        
        if (type === 'gray') {
            // Pattern màu xám: chẵn/lẻ khác màu
            return number % 2 === 0 
                ? 'bg-gray-700 text-white hover:bg-gray-800' 
                : 'bg-gray-400 text-white hover:bg-gray-500';
        } else {
            // Pattern màu xanh: chẵn/lẻ khác màu
            return number % 2 === 0 
                ? 'bg-blue-700 text-white hover:bg-blue-800' 
                : 'bg-blue-400 text-white hover:bg-blue-500';
        }
    };

    return (
        <div
            className={`seat w-5 h-5 flex items-center justify-center text-[10px] font-bold m-[1px] cursor-pointer transition-colors ${getSeatClass()}`}
            onClick={onClick}
        >
            {number}
        </div>
    );
}