import React from 'react';

export default function ScheduleSelector({ 
    schedulesByDate, 
    selectedDate, 
    selectedTime, 
    onSelectDate, 
    onSelectTime,
    formatDate,
    formatTime 
}) {
    const dates = Object.keys(schedulesByDate).sort();

    // Xử lý chọn/bỏ chọn ngày
    const handleDateClick = (dateStr) => {
        if (selectedDate === dateStr) {
            onSelectDate(null); // Bỏ chọn nếu click vào ngày đang chọn
        } else {
            onSelectDate(dateStr); // Chọn ngày mới
        }
    };

    // Xử lý chọn/bỏ chọn giờ
    const handleTimeClick = (time) => {
        if (selectedTime === time) {
            onSelectTime(null); // Bỏ chọn nếu click vào giờ đang chọn
        } else {
            onSelectTime(time); // Chọn giờ mới
        }
    };

    return (
        <section className="mt-6 px-4">
            <h2 className="text-lg font-semibold mb-3">Chọn ngày & suất diễn</h2>
            
            {/* Date Picker */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
                {dates.map(dateStr => {
                    const { dayOfWeek, day } = formatDate(dateStr);
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                        <button
                            key={dateStr}
                            onClick={() => handleDateClick(dateStr)}
                            className={`flex-shrink-0 w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                                isSelected
                                    ? 'border-[#ec5b13] bg-[#fff0e6] text-[#ec5b13]' // Cam nhạt nền, cam đậm chữ
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <span className={`text-xs ${isSelected ? 'font-medium' : 'text-slate-500'}`}>
                                {dayOfWeek}
                            </span>
                            <span className="text-xl font-bold">{day}</span>
                        </button>
                    );
                })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div className="flex gap-3 mt-4 flex-wrap">
                    {schedulesByDate[selectedDate].map(schedule => {
                        const isSelected = selectedTime === schedule.time;
                        
                        return (
                            <button
                                key={schedule.id}
                                onClick={() => handleTimeClick(schedule.time)}
                                className={`px-6 py-2.5 rounded-lg border font-medium transition-all duration-200 ${
                                    isSelected
                                        ? 'border-[#ec5b13] bg-[#fff0e6] text-[#ec5b13]' // Cam nhạt nền, cam đậm chữ
                                        : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {formatTime(schedule.time)}
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
}