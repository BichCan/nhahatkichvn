import React, { useState } from 'react';
import API_URL from '../../../config/api';
import { IoClose } from 'react-icons/io5';
import { FaCheckCircle, FaUser, FaTheaterMasks, FaMoneyBillWave } from 'react-icons/fa';

const UpdatePaymentModal = ({ isOpen, onClose, payment, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen || !payment) return null;

    const handleConfirm = async () => {
        setLoading(true);
        setMessage('');

        try {
            const userStr = localStorage.getItem('user');
            let admin_id = null;
            if (userStr) {
                const user = JSON.parse(userStr);
                admin_id = user.id;
            }

            const response = await fetch(`${API_URL}/api/admin/orders/${payment.order_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'paid',
                    admin_id: admin_id
                })
            });

            const data = await response.json();
            if (data.success) {
                onSuccess();
                onClose();
            } else {
                setMessage(data.message || 'Lỗi khi cập nhật trạng thái.');
            }
        } catch (error) {
            setMessage('Lỗi kết nối máy chủ.');
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-tr from-[#700c1e] to-[#921d33] px-10 py-10 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                    >
                        <IoClose size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <FaCheckCircle className="text-white/40 text-lg" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Xác nhận thanh toán</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight leading-none">XÁC NHẬN GIAO DỊCH</h2>
                </div>

                {/* Content */}
                <div className="px-10 py-10 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#700c1e] shadow-sm flex-shrink-0">
                                <FaUser />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Khách hàng</p>
                                <p className="font-bold text-gray-900 text-sm leading-tight">{payment.customer_name}</p>
                                <p className="text-sm text-gray-400 font-medium">{payment.customer_phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#700c1e] shadow-sm flex-shrink-0">
                                <FaTheaterMasks />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Suất diễn</p>
                                <p className="font-bold text-gray-800 text-sm leading-tight">{payment.performance_title}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-[#700c1e]">
                                    <FaMoneyBillWave />
                                    <span className="text-xs font-black uppercase tracking-widest">Tổng tiền cần thu</span>
                                </div>
                                <span className="text-lg font-black text-gray-900 tracking-tighter">
                                    {formatCurrency(payment.total_amount)}
                                </span>
                             </div>
                        </div>
                    </div>

                    {message && (
                        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-headShake">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-100 rounded-2xl text-gray-400 text-sm font-black uppercase tracking-[0.1em] hover:bg-gray-50 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-[2] px-4 py-3 bg-[#700c1e] text-white rounded-2xl text-sm font-black uppercase tracking-[0.1em] shadow-xl shadow-[#700c1e]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang xác nhận...</span>
                                </div>
                            ) : (
                                "Xác nhận đã thu tiền"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePaymentModal;
