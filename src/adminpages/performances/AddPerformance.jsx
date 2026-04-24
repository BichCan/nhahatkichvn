import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import PerformanceForm from './components/PerformanceForm';
import API_URL from '../../config/api';

const AddPerformance = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        const userStr = localStorage.getItem('user');
        let admin_id = '1';
        if (userStr) {
            try { admin_id = JSON.parse(userStr).id; } catch (e) {}
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/performances`, {
                method: 'POST',
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
                alert('Thêm vở diễn thành công!');
                navigate('/admin/performances');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error creating performance:', error);
            alert('Lỗi khi thêm vở diễn.');
        }
    };

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
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">THÊM VỞ DIỄN MỚI</h1>
                <p className="mt-3 text-gray-500 font-medium tracking-wide">Nhập thông tin chi tiết để giới thiệu vở diễn mới đến khán giả.</p>
            </div>

            <PerformanceForm 
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/performances')}
                isUpdating={false}
            />
        </div>
    );
};

export default AddPerformance;
