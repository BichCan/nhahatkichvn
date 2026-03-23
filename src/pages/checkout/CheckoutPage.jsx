import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import performancesdata from '../../data/PerformancesData';
import CardPay from './components/CardPay';
import CardDrama from './components/CardDrama';
import PopupCash from './components/PopupCash';
// Danh sách phương thức thanh toán
const paymentMethods = [
    {
        id: 'vnpay',
        name: 'VNPay',
        description: 'Thanh toán qua ứng dụng ngân hàng quét mã QR',
        icon: '💳'
    },
    {
        id: 'shopeepay',
        name: 'ShopeePay',
        description: 'Sử dụng ví điện từ ShopeePay để thanh toán',
        icon: '🛒'
    },
    {
        id: 'bank',
        name: 'Thẻ Ngân hàng',
        description: 'Thanh toán qua thẻ ATM, Visa, Mastercard',
        icon: '🏦'
    },
    {
        id:"cash",
        description:"Thanh toán bằng tiền mặt",
        name:"Tiền mặt",
        icon:"💰"
    }
];

export default function CheckoutPage() {
    const { performanceId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { selectedSeats = [], selectedDate, selectedTime } = location.state || {};

    const [selectedPayment, setSelectedPayment] = useState('bank');
    const [openPopup, setOpenPopup] = useState(false);

    // Tìm thông tin vở diễn
    const performance = performancesdata.find(p => p.id === parseInt(performanceId));

    // Tính tổng tiền
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    // Xử lý thanh toán
    const handlePayment = () => {
    setOpenPopup(true);
    };
    const dataLocal = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("ticket")) : null;

    // Quay lại trang chọn ghế
    const handleGoBack = () => {
        navigate(`/dat-ve/${performanceId}`);
    };
    const handleClosePopup= () =>{
        localStorage.setItem("ticket",JSON.stringify({
            performance,
            selectedSeats,
            selectedDate,
            selectedTime,
            total
        }))
        setOpenPopup(false)  
    }
    if (!performance) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy vở diễn</h2>
                    <button onClick={() => navigate('/')} className="text-blue-500 hover:underline">
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedSeats || selectedSeats.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Bạn chưa chọn ghế nào</h2>
                    <button onClick={handleGoBack} className="text-[#7a2323] hover:underline font-semibold">
                        ← Quay lại chọn ghế
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf8f0]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold italic font-serif text-[#5a1a1a]">
                        Nhà Hát Kịch Việt Nam
                    </h1>
                    <nav className="flex gap-6 text-sm">
                        <button onClick={handleGoBack} className="text-gray-500 hover:text-gray-700 transition-colors">
                            Chọn ghế
                        </button>
                        <span className="text-[#5a1a1a] font-bold border-b-2 border-[#5a1a1a] pb-1">
                            Thanh toán
                        </span>
                        <span className="text-gray-400">Xác nhận</span>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Cột trái - Phương thức thanh toán */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold font-serif text-[#5a1a1a] italic mb-2">
                            Chọn phương thức thanh toán
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Hoàn tất bước cuối cùng để sở hữu tấm vé vàng.
                        </p>

                        {/* Danh sách phương thức thanh toán */}
                        <div className="flex flex-col gap-3 mb-6">
                            {paymentMethods.map(method => (
                                <CardPay
                                    key={method.id}
                                    name={method.name}
                                    description={method.description}
                                    icon={method.icon}
                                    isSelected={selectedPayment === method.id}
                                    onChoose={() => setSelectedPayment(method.id)}
                                />
                            ))}
                        </div>

                        {/* Disclaimer */}
                        <div className="flex items-start gap-2 p-4 bg-[#fdf5d3] rounded-xl border border-yellow-200">
                            <span className="text-blue-500 mt-0.5">ℹ️</span>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Bằng việc nhấn "Thanh toán Ngay", bạn đồng ý với các{' '}
                                <a href="#" className="text-[#5a1a1a] underline font-semibold">Điều khoản dịch vụ</a>{' '}
                                và chính sách hoàn vé của Nhà Hát Kịch Việt Nam.
                            </p>
                        </div>
                    </div>

                    {/* Cột phải - Thông tin vở diễn */}
                    <div className="lg:col-span-2">
                        <CardDrama
                            item={performance}
                            selectedSeats={selectedSeats}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            total={total}
                            onPayment={handlePayment}
                        />
                    </div>
                </div>

                {/* Link quay lại */}
                <div className="text-center mt-8">
                    <button
                        onClick={handleGoBack}
                        className="text-sm text-gray-500 hover:text-[#5a1a1a] transition-colors font-medium"
                    >
                        ← Quay lại chọn ghế
                    </button>
                </div>
            </div>
            {openPopup && <PopupCash onSubmit={handleClosePopup} />}
        </div>
    );
}
