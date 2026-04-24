import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { 
    FaUser, FaTheaterMasks, FaMoneyBillWave, FaCalendarAlt, 
    FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
    FaPhoneAlt, FaCreditCard, FaChair, FaEdit
} from 'react-icons/fa';
import API_URL from '../../../config/api';

const OrderDetailModal = ({ isOpen, onClose, payment, onEdit }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && payment?.order_id) {
            fetchOrderDetails();
        } else {
            setDetails(null);
        }
    }, [isOpen, payment]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/orders/${payment.order_id}/details`);
            const data = await response.json();
            if (data.success) {
                console.log('data', data)
                setDetails(data);
            }
        } catch (error) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !payment) return null;

    const formatCurrency = (amount) => {
        if (!amount) return '0 VND';
        const num = parseFloat(amount);
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Calculate expiry status
    const getExpiryStatus = () => {
        if (!payment || !payment.created_at) return { label: 'Chưa xác định', color: 'text-gray-400' };
        
        // If paid, it's not expired
        if (payment.payment_status === 'paid') return { label: 'Đã hoàn tất', color: 'text-emerald-500' };
        
        const now = new Date();
        const expireDate = details?.expire_at ? new Date(details.expire_at) : new Date(new Date(payment.created_at).getTime() + 24 * 60 * 60 * 1000);
        
        if (now > expireDate) {
            return { label: 'Đã quá hạn', color: 'text-red-500' };
        } else {
            return { label: 'Chưa quá hạn', color: 'text-blue-500' };
        }
    };

    const expiryStatus = getExpiryStatus();

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

    const statusConfig = getStatusConfig(
        expiryStatus.label === 'Đã quá hạn' ? 'cancelled' : payment.payment_status
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-white/20">
                {/* Header */}
                <div className="bg-gradient-to-tr from-[#1a1a2e] to-[#16213e] px-10 py-8 text-white relative flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-7 right-7 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    >
                        <IoClose size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-6 h-[1px] bg-white/30"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Chi tiết vé đã đặt</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight leading-none mb-4">
                        #{payment.order_id}
                    </h2>
                    <div className="flex gap-2">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                            <span className={`text-[11px] font-black tracking-widest uppercase ${statusConfig.text}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                            <span className={`text-[11px] font-black tracking-widest uppercase ${expiryStatus.color}`}>
                                {expiryStatus.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard icon={<FaUser className="text-[#700c1e]" />} title="Người đặt">
                            <InfoRow label="Họ và tên" value={payment.customer_name} bold />
                            <InfoRow label="ID người dùng" value={payment.user_id} />
                            <InfoRow label="Số điện thoại" value={payment.customer_phone} icon={<FaPhoneAlt size={10} />} />
                        </InfoCard>

                        <InfoCard icon={<FaCreditCard className="text-[#700c1e]" />} title="Thanh toán">
                            <InfoRow label="Phương thức" value={payment.payment_method === 'cash' ? 'Tiền mặt' : payment.payment_method} />
                            <InfoRow label="Ngày đặt" value={formatDateTime(payment.created_at)} />
                        </InfoCard>
                    </div>

                    {/* Performance & Seats */}
                    <InfoCard icon={<FaTheaterMasks className="text-[#700c1e]" />} title="Suất diễn & Chỗ ngồi">
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="w-6 h-6 border-2 border-slate-200 border-t-[#700c1e] rounded-full animate-spin"></div>
                            </div>
                        ) : details?.items?.length > 0 ? (
                            <div className="space-y-4">
                                <div className="pb-3 border-b border-gray-100">
                                    <h5 className="text-sm font-bold text-gray-900 mb-1">{details.items[0].performance_title}</h5>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <FaCalendarAlt size={10} />
                                            <span>{new Date(details.items[0].showtime).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <FaClock size={10} />
                                            <span>{new Date(details.items[0].showtime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 block">Danh sách ghế ({details.items.length})</span>
                                    <div className="flex flex-wrap gap-2">
                                        {details.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-2 rounded-lg shadow-sm">
                                                <FaChair size={10} className="text-[#700c1e]/40" />
                                                <span className="text-xs font-black text-gray-700">{item.seat_row}{item.seat_number}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Không có thông tin chỗ ngồi.</p>
                        )}
                    </InfoCard>

                    {/* Total Amount */}
                    <div className="bg-gradient-to-r from-[#700c1e] to-[#921d33] rounded-xl p-8 flex items-center justify-between shadow-xl shadow-[#700c1e]/20">
                        <div className="flex items-center gap-4 text-white/60">
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                                <FaMoneyBillWave size={24} className="text-white" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-0.5">Tổng tiền đơn hàng</span>
                                <span className="text-xs font-bold text-white/80">Đã bao gồm phí dịch vụ</span>
                            </div>
                        </div>
                        <span className="text-4xl font-black text-white tracking-tighter">
                            {formatCurrency(payment.total_amount)}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 border border-gray-100 rounded-lg text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(payment);
                        }}
                        className="flex-1 py-4 bg-gray-900 text-white rounded-lg text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                        <FaEdit /> Sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper sub-components
const InfoCard = ({ icon, title, children }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-100 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
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
