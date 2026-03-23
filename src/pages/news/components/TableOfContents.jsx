import React from 'react';

export default function TableOfContents({ content }) {
    // Lọc các heading từ content
    const headings = content.filter(block => block.type === 'heading');
    
    if (headings.length === 0) return null;
    
    return (
        <div className="p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm sticky top-24">
            <h4 className="text-lg font-bold text-slate-900  mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Mục lục nội dung
            </h4>
            <ul className="space-y-3">
                {headings.map((heading, index) => (
                    <li key={index}>
                        <a 
                            href={`#${heading.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                            className={`text-sm block hover:text-primary transition-colors ${
                                heading.level === 2 
                                    ? 'font-medium text-primary' 
                                    : 'text-slate-600 pl-4'
                            }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}