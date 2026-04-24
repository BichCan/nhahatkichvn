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
        <div className="w-full bg-white rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center gap-1 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                <div className="w-[10%] text-[8px] font-black text-gray-400 uppercase tracking-widest">Mã Đơn</div>
                <div className="w-[20%] text-[8px] font-black text-gray-400 uppercase tracking-widest">Khách Hàng</div>
                <div className="w-[25%] text-[8px] font-black text-gray-400 uppercase tracking-widest">Vở Diễn</div>
                <div className="w-[12%] text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Tổng Tiền</div>
                <div className="w-[10%] text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">P.Thức</div>
                <div className="w-[8%] text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">TT</div>
                <div className="w-[15%] text-[8px] font-black text-gray-400 uppercase tracking-widest text-right">Thao Tác</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-50">
                {payments.map((payment) => {
                    const statusStyle = getStatusStyles(payment.payment_status);
                    const isPending = payment.payment_status?.toLowerCase() === 'pending';
                    const isPaid = payment.payment_status?.toLowerCase() === 'paid';
                    const isExpired = !isPaid && payment.created_at && (new Date() > new Date(new Date(payment.created_at).getTime() + 24 * 60 * 60 * 1000));

                    return (
                        <div key={payment.order_id} className="flex items-center gap-1 px-4 py-3 hover:bg-gray-50/50 transition-all group">
                            {/* Order ID */}
                            <div className="w-[10%] flex flex-col">
                                <span className="text-[10px] font-black text-gray-800 tracking-tighter truncate">
                                    {payment.order_id.split('-').slice(-1)[0]}
                                </span>
                            </div>

                            {/* Customer Info */}
                            <div className="w-[20%] flex flex-col min-w-0">
                                <span className="text-[11px] font-bold text-gray-900 truncate leading-tight">
                                    {payment.customer_name || `User #${payment.user_id}`}
                                </span>
                                <span className="text-[9px] text-gray-400 truncate">{payment.customer_phone}</span>
                            </div>

                            {/* Performance Info */}
                            <div className="w-[25%] flex flex-col min-w-0">
                                <span className="text-[11px] font-semibold text-gray-700 truncate leading-tight">
                                    {payment.performance_title || payment.note || 'N/A'}
                                </span>
                                {payment.performance_title && payment.note && (
                                    <span className="text-[9px] text-gray-400 truncate italic">
                                        {payment.note}
                                    </span>
                                )}
                            </div>

                            {/* Total Amount */}
                            <div className="w-[12%] text-[11px] font-black text-gray-900 text-center">
                                {formatCurrency(payment.total_amount)}
                            </div>

                            {/* Payment Method */}
                            <div className="w-[10%] text-center">
                                <span className="text-[9px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                    {payment.payment_method === 'cash' ? 'Tiền mặt' : 'Online'}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="w-[8%] flex justify-center">
                                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${isExpired ? 'bg-gray-50' : statusStyle.bg}`}>
                                    <span className={`w-1 h-1 rounded-full ${isExpired ? 'bg-gray-400' : statusStyle.dot}`}></span>
                                    <span className={`text-[8px] font-black tracking-tighter ${isExpired ? 'text-gray-500' : statusStyle.text}`}>
                                        {isExpired ? 'EXPIRED' : statusStyle.label}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="w-[15%] flex items-center justify-end gap-0.5">
                                <button
                                    onClick={() => onView(payment)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Xem chi tiết"
                                >
                                    <FaEye size={11} />
                                </button>
                                <button
                                    onClick={() => onDelete(payment.order_id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Xóa đơn hàng"
                                >
                                    <FaTrash size={11} />
                                </button>

                                {isPending && !isExpired && (
                                    <div className="flex items-center gap-0.5 border-l border-gray-100 ml-0.5 pl-0.5">
                                        <button
                                            onClick={() => onReject(payment)}
                                            className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-all"
                                            title="Hủy đơn"
                                        >
                                            <FaTimesCircle size={11} />
                                        </button>
                                        <button
                                            onClick={() => onConfirm(payment)}
                                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                                            title="Xác nhận"
                                        >
                                            <FaCheckCircle size={11} />
                                        </button>
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
