import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaTrash, FaEye, FaUser, FaClock } from 'react-icons/fa';

const PaymentList = ({ payments, loading, onConfirm, onReject, onDelete, onView }) => {
    if (loading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-gray-50 border-t-[#700c1e] rounded-full animate-spin"></div>
                <p className="text-gray-400 font-serif italic">Đang tải danh sách giao dịch...</p>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        if (!amount) return '0 K VND';
        const num = parseFloat(amount);
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1).replace('.0', '')} Tr VND`;
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(0)} K VND`;
        }
        return `${num} VND`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'PAID' };
            case 'pending':
                return { dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', label: 'PENDING' };
            case 'cancelled':
                return { dot: 'bg-gray-400', text: 'text-gray-500', bg: 'bg-gray-50', label: 'CANCELLED' };
            default:
                return { dot: 'bg-gray-400', text: 'text-gray-500', bg: 'bg-gray-50', label: status };
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[100px_220px_minmax(200px,1.5fr)_150px_150px_130px_130px] gap-4 px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã Đơn</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khách Hàng</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vở Diễn</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng Tiền</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Thanh Toán</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng Thái</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao Tác</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-50">
                {payments.map((payment) => {
                    const statusStyle = getStatusStyles(payment.payment_status);
                    const isPending = payment.payment_status?.toLowerCase() === 'pending';
                    const isPaid = payment.payment_status?.toLowerCase() === 'paid';

                    return (
                        <div key={payment.order_id} className="grid grid-cols-[100px_220px_minmax(200px,1.5fr)_150px_150px_130px_130px] gap-4 px-8 py-7 items-center hover:bg-gray-50/30 transition-all group">
                            {/* Order ID */}
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-red-900/30 uppercase tracking-tighter">#VA</span>
                                <span className="text-lg font-black text-gray-900 tracking-tighter leading-none">
                                    {payment.order_id.split('-').pop()}
                                </span>
                            </div>

                            {/* Customer Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <FaUser size={14} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-gray-900 truncate tracking-tight">{payment.customer_name}</span>
                                    <span className="text-[11px] text-gray-400 font-medium">{payment.customer_phone}</span>
                                </div>
                            </div>

                            {/* Performance Info */}
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-bold text-gray-800 text-sm truncate leading-tight">
                                    {payment.performance_title || 'N/A'}
                                </span>
                                {payment.showtime && (
                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium italic">
                                         <FaClock size={10} className="text-[#700c1e]/40" />
                                         <span>{formatTime(payment.showtime)} • {formatDate(payment.showtime)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Total Amount */}
                            <div className="text-xl font-black text-gray-900 tracking-tighter">
                                {formatCurrency(payment.total_amount)}
                            </div>

                            {/* Payment Method */}
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                                    {payment.payment_method === 'cash' ? 'Cash @ Counter' : payment.payment_method}
                                </span>
                                {isPending && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                                        <FaClock size={8} className="animate-pulse" />
                                        <span>CHỜ XỬ LÝ</span>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex justify-center">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                    <span className={`text-[10px] font-black tracking-[0.1em] ${statusStyle.text}`}>
                                        {statusStyle.label}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2">
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onReject(payment)}
                                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                                            title="Từ chối"
                                        >
                                            <FaTimesCircle size={12} /> TỪ CHỐI
                                        </button>
                                        <button
                                            onClick={() => onConfirm(payment)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-[#700c1e] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md shadow-[#700c1e]/20 hover:scale-105 active:scale-95 transition-all"
                                            title="Xác nhận thanh toán"
                                        >
                                            <FaCheckCircle size={12} /> XÁC NHẬN
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => onView(payment)}
                                            className="p-2 text-gray-400 hover:text-[#700c1e] hover:bg-red-50 rounded-lg transition-all"
                                            title="Xem chi tiết"
                                        >
                                            <FaEye size={16} />
                                        </button>
                                        {!isPaid && (
                                            <button
                                                onClick={() => onDelete(payment.order_id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Xóa đơn hàng"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {payments.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-gray-400 font-serif italic text-lg leading-relaxed">Không tìm thấy dữ liệu giao dịch nào phù hợp.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentList;
