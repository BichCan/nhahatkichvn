import React from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const NewsTable = ({ news, loading, onEdit, onDelete, onToggleStatus }) => {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Tin tức</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Ngày tạo</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Trạng thái</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {news.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-inner border border-slate-200">
                                        {item.src ? (
                                            <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] text-center p-1 font-bold uppercase">No img</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                                            {item.title}
                                        </span>
                                        <span className="text-xs text-slate-500 line-clamp-1 max-w-md font-medium">
                                            {item.content}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                {item.is_published ? (
                                    <button 
                                        onClick={() => onToggleStatus(item.id)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-50 text-green-600 hover:bg-green-100 transition-all border border-green-200 whitespace-nowrap"
                                    >
                                        <FaCheckCircle /> Hiển thị
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => onToggleStatus(item.id)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all border border-amber-200"
                                    >
                                        <FaTimesCircle /> Ẩn
                                    </button>
                                )}
                            </td>
                            <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 pr-2">
                                    <button 
                                        onClick={() => onEdit(item)}
                                        className="p-2.5 rounded-xl bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-slate-200 hover:border-blue-600 shadow-sm"
                                        title="Chỉnh sửa"
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(item.id)}
                                        className="p-2.5 rounded-xl bg-slate-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-slate-200 hover:border-red-600 shadow-sm"
                                        title="Xóa bài viết"
                                    >
                                        <FaTrash size={16} />
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
