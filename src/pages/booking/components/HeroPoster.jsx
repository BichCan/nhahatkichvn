import React from 'react';

export default function HeroPoster({ image, title }) {
    return (
        <header className="relative w-full h-72 overflow-hidden">
            <img 
                alt={title} 
                className="w-full h-full object-cover" 
                src={image }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </header>
    );
}