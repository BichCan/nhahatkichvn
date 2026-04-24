import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaCalendarAlt } from 'react-icons/fa';
import PerformanceForm from './components/PerformanceForm';
import PlaySchedules from './components/PlaySchedules';
import API_URL from '../../config/api';

const UpdatePerformance = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPerformanceData = async () => {
        setLoading(true);
        try {
            // We can use the admin list API to get details including plays
            const response = await fetch(`${API_URL}/api/admin/performances`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                const found = data.performances.find(p => p.id === parseInt(id));
                if (found) {
                    setPerformance(found);
                } else {
                    alert('Không tìm thấy vở diễn');
                    navigate('/admin/performances');
                }
            }
        } catch (error) {
            console.error('Error fetching performance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformanceData();
    }, [id]);

    const handleSubmit = async (formData) => {
        const userStr = localStorage.getItem('user');
        let admin_id = '1';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/performances/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    admin_id
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                alert('Cập nhật vở diễn thành công!');
                // We don't navigate back immediately, allow managing showtimes
                fetchPerformanceData();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating performance:', error);
            alert('Lỗi khi cập nhật vở diễn.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-bold tracking-widest text-xs uppercase">Đang tải thông tin...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <button 
                    onClick={() => navigate('/admin/performances')}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors mb-6 group"
                >
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Quay lại danh sách
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none uppercase">{performance?.title || 'CHỈNH SỬA VỞ DIỄN'}</h1>
                        <p className="mt-3 text-gray-500 font-medium tracking-wide italic">Cập nhật thông tin và quản lý lịch trình suất diễn.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {/* Performance Info Section */}
                <section>
                    <PerformanceForm 
                        initialData={performance}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/admin/performances')}
                        isUpdating={true}
                    />
                </section>

                {/* Showtimes / Plays Section */}
                <section className="pt-12 border-t border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <FaCalendarAlt className="text-red-600" /> QUẢN LÝ SUẤT DIỄN
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 font-medium italic">Thiết lập ngày và giờ biểu diễn cụ thể cho vở diễn này.</p>
                    </div>
                    
                    <PlaySchedules 
                        performanceId={id} 
                        plays={performance?.plays || []} 
                        onRefresh={fetchPerformanceData}
                    />
                </section>
            </div>
        </div>
    );
};

export default UpdatePerformance;
