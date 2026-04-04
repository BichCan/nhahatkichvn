import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeroPoster from './components/HeroPoster';
import MovieInfo from './components/MovieInfo';
import ScheduleSelector from './components/ScheduleSelector';
import SeatMap from './components/SeatMap';
import SeatLegend from './components/SeatLegend';
import BookingFooter from './components/BookingFooter';

export default function BookingPage() {
    const { performanceId } = useParams(); // Lấy ID từ URL
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [playSchedules, setPlaySchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('http://127.0.0.1:5000/api/performances').then(r => r.json()),
            fetch('http://127.0.0.1:5000/api/plays').then(r => r.json())
        ])
        .then(([perfData, playsData]) => {
            const perf = perfData.find(p => p.id === parseInt(performanceId));
            setPerformance(perf);
            setPlaySchedules(playsData.filter(s => s.p_id === parseInt(performanceId)));
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [performanceId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-700">Đang tải thông tin...</h2>
                </div>
            </div>
        );
    }

    // Nếu không tìm thấy vở diễn
    if (!performance) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy vở diễn</h2>
                    {/* <Link to="/vo-dien" className="text-blue-500 hover:underline">
                        Quay lại trang vở diễn
                    </Link> */}
                </div>
            </div>
        );
    }

    // Nhóm suất diễn theo ngày
    const schedulesByDate = playSchedules.reduce((acc, schedule) => {
        if (!acc[schedule.date]) {
            acc[schedule.date] = [];
        }
        acc[schedule.date].push(schedule);
        return acc;
    }, {});

    // Format ngày để hiển thị
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return {
            dayOfWeek: date.toLocaleDateString('vi-VN', { weekday: 'narrow' }),
            day: date.getDate(),
            month: date.getMonth() + 1,
            full: dateStr
        };
    };

    // Format giờ
    const formatTime = (timeStr) => timeStr;

    // Tính tổng tiền từ danh sách ghế đã chọn (mỗi ghế có {id, row, number, type, price})
    const calculateTotal = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

    // Xử lý khi chọn ghế - nhận danh sách thông tin chi tiết ghế từ SeatMap
    const handleSeatSelect = (seatsInfo) => {
        setSelectedSeats(seatsInfo);
    };

    return (
        <div className="bg-theater-bg font-sans pb-24 text-slate-800">
            <HeroPoster
                image={performance.src}
                title={performance.name}
            />

            <MovieInfo 
                title={performance.name}
                duration={performance.duration}
                genre={performance.type}
            />

            <ScheduleSelector 
                schedulesByDate={schedulesByDate}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={setSelectedDate}
                onSelectTime={setSelectedTime}
                formatDate={formatDate}
                formatTime={formatTime}
            />

            <section className=" relative mt-8 px-4  ">
                <div>
                    <SeatMap 
                        className=" absolute w-full h-auto"
                        selectedSeats={selectedSeats}
                        onSelectSeats={handleSeatSelect}
                    />
                </div>
            </section>

            <BookingFooter 
                selectedSeats={selectedSeats}
                total={calculateTotal()}
                performanceId={performanceId}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
            />
        </div>
    );
}