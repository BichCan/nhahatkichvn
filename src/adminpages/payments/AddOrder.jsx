import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaSearch, FaUser, FaTheaterMasks, FaCalendarAlt, FaClock, FaChair, FaCheckCircle, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import API_URL from '../../config/api';
import ScheduleSelector from '../../pages/booking/components/ScheduleSelector';
import SeatMap from '../../pages/booking/components/SeatMap';

const AddOrder = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Performance, 2: Schedule & Seats, 3: Confirm
    const [loading, setLoading] = useState(false);
    
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
    const [isSearchingUser, setIsSearchingUser] = useState(false);
    const [dbSeats, setDbSeats] = useState([]);

    useEffect(() => {
        fetchPerformances();
        fetchDbSeats();
        // Load admin info to stand for the order
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setSelectedUser(JSON.parse(userStr));
        }
    }, []);

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
        } catch (error) {
            console.error('Error fetching performances:', error);
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

    const handleSearchUser = async (query) => {
        setSearchUser(query);
        if (query.length < 2) {
            setUsers([]);
            return;
        }
        
        setIsSearchingUser(true);
        try {
            // We'll add this endpoint or search locally if needed
            const response = await fetch(`${API_URL}/api/admin/users?q=${query}`);
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearchingUser(false);
        }
    };

    const handleCreateOrder = async () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế');
            return;
        }
        setLoading(true);
        
        try {
            // 1. Chuyển đổi ID ghế từ mã (A1, B2...) sang ID thật trong DB
            const dbJoined = dbSeats.map(seat => ({
                ...seat,
                name: (seat.row || '') + String(seat.number || '')
            }));
            console.log('dbJoined', dbJoined)
            const convertedSeats = selectedSeats.map(selectedSeat => {
                const dbSeat = dbJoined.find(s => s.name === selectedSeat.id);
                return {
                    ...selectedSeat,
                    real_db_id: dbSeat ? dbSeat.id : selectedSeat.id
                };
            });

            // 2. Tạo dữ liệu gửi lên backend dựa trên mảng đã chuyển đổi
            const bookingData = convertedSeats.map(seat => ({
                performance_id: selectedPerformance.id,
                seat_id: seat.real_db_id,
                seat_row: seat.row,
                seat_number: seat.number.toString(),
                show_date: selectedDate,
                show_time: selectedTime,
                price: seat.price
            }));
            console.log('bookingData', bookingData)
            const response = await fetch(`${API_URL}/api/admin/orders/create-for-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    admin_id: selectedUser.id,
                    user_id: selectedUser.id,
                    bookings: bookingData,
                    payment_method: selectedPaymentMethod
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Tạo đơn hàng thành công!');
                navigate('/admin/payments');
            } else {
                alert(data.message || 'Lỗi khi tạo đơn hàng');
            }
        } catch (error) {
            console.error('Error creating order:', error);
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

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/admin/payments')}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#700c1e] transition-all shadow-sm"
                    >
                        <FaChevronLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Thêm Đơn Hàng Mới</h1>
                        <p className="text-gray-400 text-xs">Bước {step}: {step === 1 ? 'Chọn vở diễn' : step === 2 ? 'Chọn suất & ghế' : 'Xác nhận đơn hàng'}</p>
                    </div>
                </div>
                
                {step === 3 && (
                    <button
                        onClick={handleCreateOrder}
                        disabled={loading}
                        className="px-6 py-3 bg-[#700c1e] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#700c1e]/20 hover:bg-[#5a0a18] transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : 'Hoàn tất & Tạo đơn'}
                    </button>
                )}
            </div>

            {/* Step 1: Performance Selection */}
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
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#700c1e]/30 hover:shadow-md transition-all cursor-pointer group"
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

            {/* Step 2: Schedule & Seat Selection */}
            {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Performance Brief */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                            <img src={selectedPerformance.src} className="w-24 h-32 object-cover rounded-lg" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPerformance.name}</h2>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{selectedPerformance.description}</p>
                                <div className="flex gap-4">
                                    {selectedDate && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#700c1e]">
                                            <FaCalendarAlt /> {selectedDate}
                                        </div>
                                    )}
                                    {selectedTime && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#700c1e]">
                                            <FaClock /> {selectedTime}
                                        </div>
                                    )}
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

                    {/* Sidebar: Summary & Customer Info */}
                    <div className="space-y-6">
                        <div className="bg-[#1a1a2e] text-white p-8 rounded-2xl shadow-xl shadow-[#1a1a2e]/20 sticky top-8">
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Tóm tắt lựa chọn</h3>
                            
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
                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tổng cộng (+VAT)</div>
                                            <div className="text-3xl font-black text-white tracking-tighter">
                                                {calculateTotal().toLocaleString()}đ
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setStep(3)}
                                            className="w-full py-4 bg-[#700c1e] text-white rounded-xl font-bold hover:bg-[#5a0a18] transition-all shadow-lg shadow-[#700c1e]/20 active:scale-95"
                                        >
                                            Tiếp tục xác nhận
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

            {/* Step 3: Final Confirmation & Admin Link */}
            {step === 3 && (
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {/* Admin Info & Payment */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">1. Người đặt đơn (Admin)</h3>
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
                                <div className="text-[10px] font-black text-slate-400 px-3 py-1 bg-white border border-slate-100 rounded-full">
                                    ĐANG ĐĂNG NHẬP
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">2. Phương thức thanh toán</h3>
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
                                        <div className="flex-1">
                                            <div className={`text-sm font-bold ${selectedPaymentMethod === method.id ? 'text-[#700c1e]' : 'text-gray-700'}`}>
                                                {method.label}
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            selectedPaymentMethod === method.id ? 'border-[#700c1e]' : 'border-gray-300'
                                        }`}>
                                            {selectedPaymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#700c1e] rounded-full"></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-[10px] text-amber-800 leading-relaxed font-bold italic">
                                * Lưu ý: Đơn hàng do Admin tạo sẽ mặc định ở trạng thái "Chờ xử lý" và có thể xác nhận ngay trong danh sách thanh toán.
                            </p>
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-[#1a1a2e] text-white p-8 rounded-2xl shadow-2xl space-y-8 flex flex-col">
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">3. Kiểm tra lại đơn hàng</h3>
                        
                        <div className="space-y-6 flex-1">
                            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                <div className="w-20 h-24 overflow-hidden rounded-lg border border-white/10 shadow-lg">
                                    <img src={selectedPerformance.src} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-white mb-2 leading-tight">{selectedPerformance.name}</div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase">
                                            <FaCalendarAlt size={10} className="text-emerald-400" /> {selectedDate}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase">
                                            <FaClock size={10} className="text-amber-400" /> {selectedTime}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <FaChair size={10} /> Ghế đã chọn:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map(seat => (
                                        <span key={seat.id} className="px-3 py-2 bg-white/10 rounded-xl text-xs font-bold border border-white/5">
                                            {seat.row}{seat.number}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-white/10 mt-auto">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Phương thức</div>
                                        <div className="text-sm font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full inline-block">
                                            {selectedPaymentMethod === 'cash' ? 'Tiền mặt' : 
                                             selectedPaymentMethod === 'transfer' ? 'Chuyển khoản' : 'Thẻ ATM/Tín dụng'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Tổng thanh toán</div>
                                        <div className="text-4xl font-black text-emerald-400 tracking-tighter">
                                            {calculateTotal().toLocaleString()}đ
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleCreateOrder}
                            disabled={loading}
                            className="w-full py-4 bg-[#700c1e] text-white rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[#5a0a18] transition-all shadow-xl shadow-[#700c1e]/20 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FaCheckCircle className="group-hover:scale-110 transition-transform" /> 
                                    HOÀN TẤT & TẠO ĐƠN
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddOrder;
