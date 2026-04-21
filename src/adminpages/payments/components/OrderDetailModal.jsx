import React from 'react';
import { IoClose } from 'react-icons/io5';
import { 
    FaUser, FaTheaterMasks, FaMoneyBillWave, FaCalendarAlt, 
    FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
    FaPhoneAlt, FaStickyNote, FaCreditCard
} from 'react-icons/fa';

const OrderDetailModal = ({ isOpen, onClose, payment }) => {
    if (!isOpen || !payment) return null;

    const formatCurrency = (amount) => {
        if (!amount) return '0 VND';
        const num = parseFloat(amount);
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1).replace('.0', '')} Triệu VND`;
        }
        if (num >= 1000) {
            return `${Math.round(num / 1000)} K VND`;
        }
        return `${num} VND`;
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return { 
                    icon: <FaCheckCircle />, 
                    label: 'Đã thanh toán', 
                    bg: 'bg-emerald-50', 
                    text: 'text-emerald-600',
                    border: 'border-emerald-100',
                    dot: 'bg-emerald-500'
                };
            case 'pending':
                return { 
                    icon: <FaHourglassHalf />, 
                    label: 'Chờ xử lý', 
                    bg: 'bg-amber-50', 
                    text: 'text-amber-600',
                    border: 'border-amber-100',
                    dot: 'bg-amber-500'
                };
            case 'cancelled':
                return { 
                    icon: <FaTimesCircle />, 
                    label: 'Đã hủy', 
                    bg: 'bg-gray-50', 
                    text: 'text-gray-500',
                    border: 'border-gray-100',
                    dot: 'bg-gray-400'
                };
            default:
                return { 
                    icon: <FaHourglassHalf />, 
                    label: status, 
                    bg: 'bg-gray-50', 
                    text: 'text-gray-500',
                    border: 'border-gray-100',
                    dot: 'bg-gray-400'
                };
        }
    };

    const statusConfig = getStatusConfig(payment.payment_status);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-tr from-[#1a1a2e] to-[#16213e] px-10 py-8 text-white relative flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-7 right-7 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                    >
                        <IoClose size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-6 h-[1px] bg-white/30"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Chi tiết đơn hàng</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight leading-none mb-4">
                        #{payment.order_id}
                    </h2>
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                        <span className={`text-[11px] font-black tracking-widest uppercase ${statusConfig.text}`}>
                            {statusConfig.label}
                        </span>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Two-column grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Customer Info */}
                        <InfoCard icon={<FaUser className="text-[#700c1e]" />} title="Thông tin khách hàng">
                            <InfoRow label="Họ và tên" value={payment.customer_name} bold />
                            <InfoRow label="Số điện thoại" value={payment.customer_phone} icon={<FaPhoneAlt size={10} />} />
                        </InfoCard>

                        {/* Payment Info */}
                        <InfoCard icon={<FaCreditCard className="text-[#700c1e]" />} title="Thông tin thanh toán">
                            <InfoRow label="Phương thức" value={
                                payment.payment_method === 'cash' ? 'Tiền mặt tại quầy' : payment.payment_method
                            } />
                            <InfoRow label="Ngày thanh toán" value={
                                payment.payment_date ? formatDateTime(payment.payment_date) : 'Chưa thanh toán'
                            } />
                        </InfoCard>
                    </div>

                    {/* Performance Info */}
                    <InfoCard icon={<FaTheaterMasks className="text-[#700c1e]" />} title="Thông tin suất diễn">
                        <div className="space-y-3">
                            <InfoRow label="Vở diễn" value={payment.performance_title || 'Không có thông tin'} bold />
                            {payment.showtime && (
                                <div className="flex flex-wrap gap-3 pt-1">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <FaCalendarAlt size={11} className="text-[#700c1e]/50" />
                                        <span className="text-xs font-bold text-gray-600">
                                            {new Date(payment.showtime).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <FaClock size={11} className="text-[#700c1e]/50" />
                                        <span className="text-xs font-bold text-gray-600">
                                            {new Date(payment.showtime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </InfoCard>

                    {/* Note */}
                    {payment.note && (
                        <InfoCard icon={<FaStickyNote className="text-[#700c1e]" />} title="Ghi chú">
                            <p className="text-gray-600 font-medium text-sm leading-relaxed">{payment.note}</p>
                        </InfoCard>
                    )}

                    {/* Timeline Info */}
                    <InfoCard icon={<FaClock className="text-[#700c1e]" />} title="Lịch sử đơn hàng">
                        <InfoRow label="Ngày tạo đơn" value={formatDateTime(payment.created_at)} />
                    </InfoCard>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-[#700c1e] to-[#921d33] rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white/60">
                            <FaMoneyBillWave size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Tổng thanh toán</span>
                        </div>
                        <span className="text-3xl font-black text-white tracking-tighter">
                            {formatCurrency(payment.total_amount)}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-4 border border-gray-100 rounded-2xl text-gray-400 text-sm font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper sub-components
const InfoCard = ({ icon, title, children }) => (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
        </div>
        {children}
    </div>
);

const InfoRow = ({ label, value, bold, icon }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1.5">
            {icon && <span className="text-gray-400">{icon}</span>}
            <span className={`text-sm text-gray-800 ${bold ? 'font-bold' : 'font-medium'}`}>{value || '—'}</span>
        </div>
    </div>
);

export default OrderDetailModal;
