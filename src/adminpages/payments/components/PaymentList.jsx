import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaTrash, FaEye, FaUser, FaClock } from 'react-icons/fa';

const PaymentList = ({ payments, loading, onConfirm, onReject, onDelete, onView }) => {
    if (loading) {
        return (
            <div className="w-full h-48 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 border-2 border-gray-100 border-t-[#700c1e] rounded-full animate-spin"></div>
                <p className="text-gray-400 text-xs italic">Đang tải danh sách giao dịch...</p>
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
        <div className="w-full bg-white rounded-xl overflow-x-auto border border-gray-100 shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[80px_180px_minmax(160px,1fr)_100px_120px_100px_120px] gap-3 px-5 py-3 bg-gray-50/80 border-b border-gray-100 min-w-[900px]">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mã Đơn</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Khách Hàng</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vở Diễn</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tổng Tiền</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Thanh Toán</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">TT</div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Thao Tác</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-50 min-w-[900px]">
                {payments.map((payment) => {
                    const statusStyle = getStatusStyles(payment.payment_status);
                    const isPending = payment.payment_status?.toLowerCase() === 'pending';
                    const isPaid = payment.payment_status?.toLowerCase() === 'paid';

                    return (
                        <div key={payment.order_id} className="grid grid-cols-[80px_180px_minmax(160px,1fr)_100px_120px_100px_120px] gap-3 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-all group">
                            {/* Order ID */}
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">#ORD</span>
                                <span className="text-xs font-black text-gray-800 tracking-tight leading-tight">
                                    {payment.order_id.split('-').slice(-2).join('-')}
                                </span>
                            </div>

                            {/* Customer Info */}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <FaUser size={10} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-gray-900 truncate leading-tight">{payment.customer_name}</span>
                                    <span className="text-[10px] text-gray-400">{payment.customer_phone}</span>
                                </div>
                            </div>

                            {/* Performance Info */}
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-xs font-semibold text-gray-800 truncate leading-tight">
                                    {payment.performance_title || 'N/A'}
                                </span>
                                {payment.showtime && (
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <FaClock size={8} className="text-[#700c1e]/30" />
                                        {formatTime(payment.showtime)} · {formatDate(payment.showtime)}
                                    </span>
                                )}
                            </div>

                            {/* Total Amount */}
                            <div className="text-sm font-black text-gray-900 tracking-tight">
                                {formatCurrency(payment.total_amount)}
                            </div>

                            {/* Payment Method */}
                            <div className="flex flex-col items-center gap-1 text-center">
                                <span className="text-[10px] font-semibold text-gray-500 leading-tight">
                                    {payment.payment_method === 'cash' ? 'Tiền mặt' : payment.payment_method}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex justify-center">
                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${statusStyle.bg}`}>
                                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${statusStyle.dot}`}></span>
                                    <span className={`text-[9px] font-black tracking-wide ${statusStyle.text}`}>
                                        {statusStyle.label}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-1">
                                {isPending ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => onReject(payment)}
                                            className="flex items-center gap-1 px-2 py-1.5 border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg text-[10px] font-black uppercase transition-all"
                                            title="Từ chối"
                                        >
                                            <FaTimesCircle size={10} /> Hủy
                                        </button>
                                        <button
                                            onClick={() => onConfirm(payment)}
                                            className="flex items-center gap-1 px-2 py-1.5 bg-[#700c1e] text-white rounded-lg text-[10px] font-black uppercase shadow-sm hover:scale-105 active:scale-95 transition-all"
                                            title="Xác nhận thanh toán whitespace-nowrap"
                                        >
                                            <FaCheckCircle size={10} /> Xác nhận
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => onView(payment)}
                                            className="p-1.5 text-gray-400 hover:text-[#700c1e] hover:bg-red-50 rounded-lg transition-all"
                                            title="Xem chi tiết"
                                        >
                                            <FaEye size={13} />
                                        </button>
                                        {!isPaid && (
                                            <button
                                                onClick={() => onDelete(payment.order_id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Xóa đơn hàng"
                                            >
                                                <FaTrash size={13} />
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
                <div className="py-12 text-center">
                    <p className="text-gray-400 text-sm italic">Không tìm thấy dữ liệu giao dịch nào phù hợp.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentList;
