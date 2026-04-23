import React, { useState, useEffect } from 'react';
import PaymentList from './components/PaymentList';
import UpdatePaymentModal from './components/UpdatePaymentModal';
import OrderDetailModal from './components/OrderDetailModal';
import API_URL from '../../config/api';
import { FaSearch, FaFilter, FaRedo, FaFileExport } from 'react-icons/fa';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewPayment, setViewPayment] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/orders`);
            const data = await response.json();
            if (data.success) {
                setPayments(data.orders);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách thanh toán:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = 
            payment.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.customer_phone.includes(searchTerm);
        
        const matchesTab = activeTab === 'all' || payment.payment_status === activeTab;
        
        return matchesSearch && matchesTab;
    });

    const handleConfirmPayment = (payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const handleViewDetail = (payment) => {
        setViewPayment(payment);
        setIsDetailOpen(true);
    };

    const handleReject = async (payment) => {
        if (!window.confirm(`Từ chối đơn hàng #${payment.order_id}?\nĐơn sẽ chuyển sang trạng thái ĐÃ HỦY và có thể xóa sau.`)) return;

        try {
            const userStr = localStorage.getItem('user');
            let admin_id = null;
            if (userStr) { admin_id = JSON.parse(userStr).id; }

            const response = await fetch(`${API_URL}/api/admin/orders/${payment.order_id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled', admin_id })
            });
            const data = await response.json();
            if (data.success) {
                fetchPayments();
            } else {
                alert(data.message || 'Lỗi khi từ chối đơn hàng');
            }
        } catch (error) {
            alert('Lỗi kết nối máy chủ');
        }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;
        
        try {
            const userStr = localStorage.getItem('user');
            let admin_id = null;
            if (userStr) { admin_id = JSON.parse(userStr).id; }

            const response = await fetch(`${API_URL}/api/admin/orders/${orderId}?admin_id=${admin_id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchPayments();
            } else {
                alert(data.message || 'Lỗi khi xóa đơn hàng');
            }
        } catch (error) {
            alert('Lỗi kết nối máy chủ');
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-fadeIn pb-20">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-[2px] bg-[#700c1e]"></span>
                            <span className="text-[10px] font-black text-[#700c1e] uppercase tracking-[0.3em]">Hệ thống kế toán</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-3 uppercase">QUẢN LÝ THANH TOÁN</h1>
                        <p className="text-gray-400 font-serif italic text-lg leading-relaxed max-w-2xl">
                            Theo dõi và xác nhận các giao dịch đặt vé xem kịch.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={fetchPayments}
                            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#700c1e] hover:border-[#700c1e]/20 transition-all shadow-sm"
                            title="Tải lại dữ liệu"
                        >
                            <FaRedo className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
                            <FaFileExport className="text-[#700c1e]" /> XUẤT BÁO CÁO
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#700c1e] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo mã đơn hàng, khách hàng hoặc số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#700c1e]/5 focus:border-[#700c1e]/20 transition-all font-medium shadow-sm"
                    />
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'paid', label: 'Đã thanh toán' },
                        { id: 'pending', label: 'Chờ xử lý' },
                        { id: 'cancelled', label: 'Đã hủy' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id 
                                ? 'bg-[#700c1e] text-white shadow-lg shadow-[#700c1e]/20' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <PaymentList 
                payments={filteredPayments} 
                loading={loading}
                onConfirm={handleConfirmPayment}
                onReject={handleReject}
                onDelete={handleDelete}
                onView={handleViewDetail}
            />

            <UpdatePaymentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                payment={selectedPayment}
                onSuccess={fetchPayments}
            />

            <OrderDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                payment={viewPayment}
            />
        </div>
    );
};

export default PaymentManagement;
