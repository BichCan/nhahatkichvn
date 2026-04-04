import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CardPay from './components/CardPay';
import CardDrama from './components/CardDrama';
import PopupCash from './components/PopupCash';

const paymentMethods = [
    { id: 'vnpay', name: 'VNPay', description: 'Thanh toán qua ứng dụng ngân hàng quét mã QR', icon: '💳' },
    { id: 'shopeepay', name: 'ShopeePay', description: 'Sử dụng ví điện tử ShopeePay để thanh toán', icon: '🛒' },
    { id: 'bank', name: 'Thẻ Ngân hàng', description: 'Thanh toán qua thẻ ATM, Visa, Mastercard', icon: '🏦' },
    { id: "cash", description: "Thanh toán bằng tiền mặt", name: "Tiền mặt", icon: "💰" }
];

export default function CheckoutPage() {
    const { performanceId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { selectedSeats = [], selectedDate, selectedTime } = location.state || {};

    const [selectedPayment, setSelectedPayment] = useState('bank');
    const [openPopup, setOpenPopup] = useState(false);
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location.pathname, message: "Vui lòng đăng nhập để tiếp tục đặt vé" } });
            return;
        }
        
        fetch('http://127.0.0.1:5000/api/performances')
            .then(res => res.json())
            .then(data => {
                const perf = data.find(p => p.id === parseInt(performanceId));
                setPerformance(perf);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [performanceId]);

    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const handlePayment = () => {
        setOpenPopup(true);
    };

    const handleGoBack = () => {
        navigate(`/dat-ve/${performanceId}`);
    };

    // Khi xác nhận thanh toán: gửi về backend sau đó điều hướng
    const handleClosePopup = async () => {
        const now = Date.now();

        // Tạo dữ liệu vé chuẩn theo schema backend
        const ticketDataList = selectedSeats.map((seat, idx) => {
            const ticketCode = `NTK-${performance?.id || "00"}-${seat.row || ""}${seat.number || seat.id || ""}-${(now + idx).toString().slice(-7)}`;
            return {
                performance_id: performance.id,
                seat_id: seat.id.toString(),
                seat_row: seat.row,
                seat_number: seat.number.toString(),
                show_date: selectedDate,
                show_time: selectedTime,
                price: seat.price,
                payment_method: selectedPayment,
                order_code: ticketCode
            };
        });

        try {
            const response = await fetch('http://127.0.0.1:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bookings: ticketDataList })
            });

            const result = await response.json();
            if (result.success) {
                setOpenPopup(false);
                navigate("/thong-tin-dat-ve");
            } else {
                alert(result.message || "Đặt vé thất bại");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Không thể kết nối đến máy chủ");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-700">Đang tải thông tin...</h2>
                </div>
            </div>
        );
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

                        {/* Tóm tắt vé sẽ được tạo */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                            <p className="text-sm font-semibold text-amber-800 mb-2">
                                📋 {selectedSeats.length} vé sẽ được tạo:
                            </p>
                            <div className="space-y-1">
                                {selectedSeats.map((seat, i) => (
                                    <div key={i} className="flex justify-between text-xs text-amber-700">
                                        <span>🪑 Ghế {seat.row}{seat.number} – {seat.type || "Ghế thường"}</span>
                                        <span className="font-bold">{(seat.price || 0).toLocaleString("vi-VN")}đ</span>
                                    </div>
                                ))}
                            </div>
                        </div>

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
