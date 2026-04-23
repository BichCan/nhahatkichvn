import React, { useState, useEffect } from 'react';
import PaymentList from './components/PaymentList';
import UpdatePaymentModal from './components/UpdatePaymentModal';
import OrderDetailModal from './components/OrderDetailModal';
import API_URL from '../../config/api';
import { FaSearch, FaRedo, FaFileExport } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Normalize Vietnamese diacritics for jsPDF (latin-1 font only) ──
const vn = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const formatCurrencyPDF = (amount) => {
    if (!amount) return '0 VND';
    const num = parseFloat(amount);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace('.0', '')} Tr VND`;
    if (num >= 1000) return `${Math.round(num / 1000)} K VND`;
    return `${num} VND`;
};

const statusLabel = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':      return 'Da thanh toan';
        case 'pending':   return 'Cho xu ly';
        case 'cancelled': return 'Da huy';
        default: return vn(status || '-');
    }
};

const exportPaymentsPDF = (payments) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // ── Header ──
    doc.setFillColor(112, 12, 30);
    doc.rect(0, 0, 297, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('NHA HAT KICH VIET NAM', 14, 10);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('BAO CAO QUAN LY THANH TOAN', 14, 17);

    const now = new Date().toLocaleString('vi-VN');
    doc.setFontSize(8);
    doc.text(`Xuat ngay: ${vn(now)}`, 297 - 14, 17, { align: 'right' });

    // ── Table ──
    autoTable(doc, {
        startY: 27,
        head: [['Ma Don', 'Khach Hang', 'SDT', 'Vo Dien', 'Tong Tien', 'Phuong Thuc', 'Trang Thai', 'Ngay Tao']],
        body: payments.map(p => [
            p.order_id || '-',
            vn(p.customer_name),
            p.customer_phone || '-',
            vn(p.performance_title || 'N/A'),
            formatCurrencyPDF(p.total_amount),
            p.payment_method === 'cash' ? 'Tien mat' : vn(p.payment_method || '-'),
            statusLabel(p.payment_status),
            p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : '-'
        ]),
        headStyles: {
            fillColor: [112, 12, 30],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
        },
        bodyStyles: { fontSize: 7.5, cellPadding: 2.5 },
        alternateRowStyles: { fillColor: [252, 248, 248] },
        columnStyles: {
            0: { cellWidth: 38 },
            4: { halign: 'right' },
            6: { halign: 'center' },
        },
        didParseCell(data) {
            if (data.section === 'body' && data.column.index === 6) {
                const v = data.cell.raw;
                if (v === 'Da thanh toan') data.cell.styles.textColor = [5, 150, 105];
                else if (v === 'Cho xu ly') data.cell.styles.textColor = [180, 120, 0];
                else if (v === 'Da huy') data.cell.styles.textColor = [120, 120, 120];
            }
        },
        margin: { left: 14, right: 14 },
    });

    // ── Footer ──
    const finalY = doc.lastAutoTable.finalY + 6;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Tong so don hang: ${payments.length}`, 14, finalY);
    doc.text('Tai lieu duoc tao tu dong - He thong quan tri Nha Hat Kich Viet Nam', 297 / 2, finalY, { align: 'center' });

    doc.save(`payments_${Date.now()}.pdf`);
};

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
        <div className="mx-auto animate-fadeIn pb-12">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 h-[2px] bg-[#700c1e]"></span>
                            <span className="text-[9px] font-black text-[#700c1e] uppercase tracking-[0.25em]">Hệ thống kế toán</span>
                        </div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase">QUẢN LÝ THANH TOÁN</h1>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Theo dõi và xác nhận các giao dịch đặt vé xem kịch.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={fetchPayments}
                            className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#700c1e] hover:border-[#700c1e]/20 transition-all shadow-sm text-xs"
                            title="Tải lại dữ liệu"
                        >
                            <FaRedo size={13} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all shadow-sm"
                            onClick={() => exportPaymentsPDF(filteredPayments)}
                        >
                            <FaFileExport size={12} className="text-[#700c1e]" /> Xuất báo cáo
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative group flex-1">
                    <FaSearch size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#700c1e] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm mã đơn, khách hàng, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#700c1e]/10 focus:border-[#700c1e]/30 transition-all font-medium shadow-sm"
                    />
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm gap-0.5 flex-shrink-0">
                    {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'paid', label: 'Đã TT' },
                        { id: 'pending', label: 'Chờ' },
                        { id: 'cancelled', label: 'Đã hủy' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${
                                activeTab === tab.id 
                                ? 'bg-[#700c1e] text-white shadow shadow-[#700c1e]/20' 
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
