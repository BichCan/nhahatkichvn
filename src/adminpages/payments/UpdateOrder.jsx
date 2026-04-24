import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaSearch, FaUser, FaTheaterMasks, FaCalendarAlt, FaClock, FaChair, FaCheckCircle, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import API_URL from '../../config/api';
import ScheduleSelector from '../../pages/booking/components/ScheduleSelector';
import SeatMap from '../../pages/booking/components/SeatMap';
import seatsData from '../../data/SeatsData';

const UpdateOrder = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(2); // Start at step 2 for editing
    const [loading, setLoading] = useState(false);
    const [isFetchingOrder, setIsFetchingOrder] = useState(true);
    
    // Selection state
    const [performances, setPerformances] = useState([]);
    const [selectedPerformance, setSelectedPerformance] = useState(null);
    const [playSchedules, setPlaySchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [searchPerf, setSearchPerf] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    
    // User info state
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [dbSeats, setDbSeats] = useState([]);

    useEffect(() => {
        const initData = async () => {
            const allPerfs = await fetchPerformances();
            await fetchDbSeats();
            await fetchOrderDetails(allPerfs);
            
            // Load admin info
            const userStr = localStorage.getItem('user');
            if (userStr) {
                setSelectedUser(JSON.parse(userStr));
            }
        };
        initData();
    }, [orderId]);

    const fetchDbSeats = async () => {
        try {
            const response = await fetch(`${API_URL}/api/seats`);
            const data = await response.json();
            setDbSeats(data);
        } catch (error) {
            console.error('Error fetching seats:', error);
        }
    };

    const fetchPerformances = async () => {
        try {
            const response = await fetch(`${API_URL}/api/performances`);
            const data = await response.json();
            setPerformances(data);
            return data;
        } catch (error) {
            console.error('Error fetching performances:', error);
            return [];
        }
    };

    const fetchOrderDetails = async (allPerfs) => {
        setIsFetchingOrder(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/details`);
            const data = await response.json();
            if (data.success && data.items.length > 0) {
                const firstItem = data.items[0];
                
                const perf = allPerfs.find(p => p.id === firstItem.performance_id);
                if (perf) {
                    setSelectedPerformance(perf);
                    await fetchPlays(perf.id);
                }

                // Parse showtime
                if (firstItem.showtime) {
                    const parts = firstItem.showtime.split(' ');
                    setSelectedDate(parts[0]);
                    setSelectedTime(parts[1].substring(0, 5));
                }

                // Map seats
                const mappedSeats = data.items.map(item => {
                    const r = item.seat_row;
                    const isVip = ['C', 'D', 'E'].includes(r) || 
                                 seatsData.secondaryRows.default.includes(r) ||
                                 seatsData.secondaryRows.extended.includes(r);
                    return {
                        id: `${item.seat_row}${item.seat_number}`,
                        row: item.seat_row,
                        number: item.seat_number,
                        price: item.price,
                        type: isVip ? 'vip' : 'regular'
                    };
                });
                setSelectedSeats(mappedSeats);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setIsFetchingOrder(false);
        }
    };

    const fetchPlays = async (performanceId) => {
        try {
            const response = await fetch(`${API_URL}/api/plays`);
            const data = await response.json();
            setPlaySchedules(data.filter(s => s.p_id === parseInt(performanceId)));
        } catch (error) {
            console.error('Error fetching plays:', error);
        }
    };

    const handleSelectPerformance = (perf) => {
        setSelectedPerformance(perf);
        fetchPlays(perf.id);
        setStep(2);
    };

    const handleUpdateOrder = async () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế');
            return;
        }
        setLoading(true);
        
        try {
            // 1. Chuyển đổi ID ghế
            const dbJoined = dbSeats.map(seat => ({
                ...seat,
                name: (seat.row || '') + String(seat.number || '')
            }));
            
            const convertedSeats = selectedSeats.map(selectedSeat => {
                const dbSeat = dbJoined.find(s => s.name === selectedSeat.id);
                return {
                    ...selectedSeat,
                    real_db_id: dbSeat ? dbSeat.id : selectedSeat.id
                };
            });

            // 2. Tạo dữ liệu gửi lên backend
            const bookingData = convertedSeats.map(seat => ({
                performance_id: selectedPerformance.id,
                seat_id: seat.real_db_id,
                seat_row: seat.row,
                seat_number: seat.number.toString(),
                show_date: selectedDate,
                show_time: selectedTime,
                price: seat.price
            }));

            const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    admin_id: selectedUser.id,
                    bookings: bookingData,
                    payment_method: selectedPaymentMethod
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Cập nhật đơn hàng thành công!');
                navigate('/admin/payments');
            } else {
                alert(data.message || 'Lỗi khi cập nhật đơn hàng');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Không thể kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    // Formats for reuse
    const schedulesByDate = playSchedules.reduce((acc, schedule) => {
        if (!acc[schedule.date]) acc[schedule.date] = [];
        acc[schedule.date].push(schedule);
        return acc;
    }, {});

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return {
            dayOfWeek: date.toLocaleDateString('vi-VN', { weekday: 'narrow' }),
            day: date.getDate(),
            month: date.getMonth() + 1,
            full: dateStr
        };
    };

    const calculateTotal = () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0) * 1.08;

    if (isFetchingOrder) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-[#700c1e] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/payments')}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#700c1e] transition-all shadow-sm"
                    >
                        <FaChevronLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sửa Đơn Hàng #{orderId}</h1>
                        <p className="text-gray-400 text-xs">Bước {step}: {step === 1 ? 'Chọn vở diễn' : step === 2 ? 'Chọn suất & ghế' : 'Xác nhận thay đổi'}</p>
                    </div>
                </div>
                
                {(step === 3 || step === 2) && (
                    <button
                        onClick={step === 2 ? () => setStep(3) : handleUpdateOrder}
                        disabled={loading}
                        className="px-6 py-3 bg-[#700c1e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#700c1e]/20 hover:bg-[#5a0a18] transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : step === 2 ? 'Tiếp tục' : 'Cập nhật đơn hàng'}
                    </button>
                )}
            </div>

            {/* Step 2: Schedule & Seat Selection (Main focus for Edit) */}
            {step === 2 && selectedPerformance && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Performance Brief */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                            <img src={selectedPerformance.src} className="w-24 h-32 object-cover rounded-lg" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPerformance.name}</h2>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{selectedPerformance.description}</p>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="text-[10px] font-black text-[#700c1e] uppercase tracking-widest bg-[#700c1e]/5 px-3 py-1 rounded-full hover:bg-[#700c1e]/10"
                                    >
                                        Đổi vở diễn
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Selector */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">1. Chọn suất diễn</h3>
                            <ScheduleSelector 
                                schedulesByDate={schedulesByDate}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                onSelectDate={(date) => {
                                    setSelectedDate(date);
                                    setSelectedTime(null);
                                    setSelectedSeats([]);
                                }}
                                onSelectTime={(time) => {
                                    setSelectedTime(time);
                                    setSelectedSeats([]);
                                }}
                                formatDate={formatDate}
                                formatTime={(t) => t}
                            />
                        </div>

                        {/* Seat Map */}
                        {selectedDate && selectedTime && (
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">2. Chọn vị trí ghế</h3>
                                <div className="min-h-[400px] relative">
                                    <SeatMap 
                                        performanceId={selectedPerformance.id}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        selectedSeats={selectedSeats.map(s => s.id)}
                                        onSelectSeats={setSelectedSeats}
                                        isAdmin={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Summary */}
                    <div className="space-y-6">
                        <div className="bg-[#1a1a2e] text-white p-8 rounded-2xl shadow-xl shadow-[#1a1a2e]/20 sticky top-8">
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Tóm tắt thay đổi</h3>
                            
                            {selectedSeats.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        {selectedSeats.map(seat => (
                                            <div key={seat.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#700c1e] rounded-lg flex items-center justify-center">
                                                        <FaChair className="text-white" size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold">{seat.row}{seat.number}</div>
                                                        <div className="text-[10px] text-white/40 uppercase tracking-tighter">{seat.type}</div>
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold">{(seat.price || 0).toLocaleString()}đ</div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex justify-between items-end mb-6">
                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tổng cộng mới (+VAT)</div>
                                            <div className="text-3xl font-black text-white tracking-tighter">
                                                {calculateTotal().toLocaleString()}đ
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setStep(3)}
                                            className="w-full py-4 bg-[#700c1e] text-white rounded-xl font-bold hover:bg-[#5a0a18] transition-all shadow-lg shadow-[#700c1e]/20 active:scale-95"
                                        >
                                            Xem lại & Xác nhận
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center text-white/30 italic text-sm">
                                    Vui lòng chọn suất diễn và vị trí ghế...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 1: In case they want to change performance */}
            {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Tìm tên vở diễn..."
                            value={searchPerf}
                            onChange={(e) => setSearchPerf(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#700c1e]/10 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {performances
                            .filter(p => p.name.toLowerCase().includes(searchPerf.toLowerCase()))
                            .map(p => (
                            <div 
                                key={p.id}
                                onClick={() => handleSelectPerformance(p)}
                                className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#700c1e]/30 hover:shadow-md transition-all cursor-pointer group ${selectedPerformance?.id === p.id ? 'border-[#700c1e] ring-2 ring-[#700c1e]/10' : ''}`}
                            >
                                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                                    <img src={p.src} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <span>{p.type}</span>
                                    <span>•</span>
                                    <span>{p.duration} phút</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Final Confirmation */}
            {step === 3 && selectedPerformance && (
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {/* Admin Info & Payment */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Người xác nhận (Admin)</h3>
                            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 text-slate-500 shadow-sm">
                                        <FaUser size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-900">{selectedUser?.full_name || 'Admin User'}</div>
                                        <div className="text-xs text-slate-600/70 font-bold">{selectedUser?.email || 'admin@nhahatkich.vn'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Phương thức thanh toán</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: 'cash', label: 'Tiền mặt (tại quầy)', icon: <FaMoneyBillWave /> },
                                    { id: 'transfer', label: 'Chuyển khoản ngân hàng', icon: <FaCreditCard /> },
                                    { id: 'card', label: 'Thẻ ATM / Tín dụng', icon: <FaCreditCard /> }
                                ].map(method => (
                                    <div 
                                        key={method.id}
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            selectedPaymentMethod === method.id 
                                            ? 'border-[#700c1e] bg-[#700c1e]/5 shadow-sm' 
                                            : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            selectedPaymentMethod === method.id ? 'bg-[#700c1e] text-white' : 'bg-white text-gray-400 border border-gray-100'
                                        }`}>
                                            {method.icon}
                                        </div>
                                        <div className="flex-1 text-sm font-bold">{method.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#1a1a2e] text-white p-8 rounded-2xl shadow-2xl flex flex-col">
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Xác nhận thay đổi đơn hàng</h3>
                        
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                <img src={selectedPerformance.src} className="w-16 h-20 object-cover rounded-lg border border-white/10" />
                                <div>
                                    <div className="text-lg font-black text-white mb-1">{selectedPerformance.name}</div>
                                    <div className="text-[10px] text-white/50 font-bold uppercase">{selectedDate} @ {selectedTime}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ghế đã chọn:</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map(seat => (
                                        <span key={seat.id} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold">
                                            {seat.row}{seat.number}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 mt-auto flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Tổng cộng mới</div>
                                    <div className="text-3xl font-black text-emerald-400 tracking-tighter">
                                        {calculateTotal().toLocaleString()}đ
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleUpdateOrder}
                            disabled={loading}
                            className="w-full mt-8 py-4 bg-[#700c1e] text-white rounded-xl font-black text-sm hover:bg-[#5a0a18] transition-all shadow-xl shadow-[#700c1e]/20 active:scale-95 disabled:opacity-30"
                        >
                            {loading ? 'Đang cập nhật...' : 'XÁC NHẬN CẬP NHẬT'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateOrder;
