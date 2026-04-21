import React from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const NewsTable = ({ news, loading }) => {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tin tức</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {news.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                                        {item.src ? (
                                            <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-1">No img</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-1">
                                            {item.title}
                                        </span>
                                        <span className="text-xs text-gray-500 line-clamp-1 max-w-md">
                                            {item.content}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs text-gray-400">
                                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                {item.is_published ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500">
                                        <FaCheckCircle /> Hiển thị
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500">
                                        <FaTimesCircle /> Ẩn
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 rounded-lg bg-white/5 text-blue-500 hover:bg-blue-500/20 transition-colors">
                                        <FaEdit size={14} />
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/5 text-red-500 hover:bg-red-500/20 transition-colors">
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {news.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                                Chưa có tin tức nào được tạo.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NewsTable;
