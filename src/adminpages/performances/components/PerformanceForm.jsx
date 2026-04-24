import React, { useState, useEffect } from 'react';
import {
    FaSave, FaTimes, FaImage, FaClock, FaTheaterMasks,
    FaTag, FaStar, FaHashtag, FaUserPlus, FaTrash, FaUsers, FaUpload
} from 'react-icons/fa';
import API_URL from '../../../config/api';

const PERFORMANCE_TYPES = [
    'Kịch nói',
    'Hài kịch',
    'Bi kịch',
    'Nhạc kịch',
    'Kịch thiếu nhi',
    'Kịch tâm lý',
    'Kịch lịch sử',
];

const PerformanceForm = ({ initialData, onSubmit, onCancel, isUpdating }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 120,
        type: 'Kịch nói',
        poster_url: '',
        status: 'active',
        rating_avg: 0,
        rating_count: 0,
    });

    // Artist cast state
    const [artists, setArtists] = useState([]);
    const [cast, setCast] = useState([]);
    const [selectedArtistId, setSelectedArtistId] = useState('');
    const [characterName, setCharacterName] = useState('');

    const [uploading, setUploading] = useState(false);

    // Fetch artist list
    useEffect(() => {
        fetch(`${API_URL}/api/artists`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setArtists(data);
            })
            .catch(err => console.error('Error fetching artists:', err));
    }, []);

    // Pre-fill when editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                duration: initialData.duration || 120,
                type: initialData.type || 'Kịch nói',
                poster_url: initialData.poster_url || '',
                status: initialData.status || 'active',
                rating_avg: initialData.rating_avg ?? 0,
                rating_count: initialData.rating_count ?? 0,
            });
            if (initialData.artists_cast) {
                setCast(initialData.artists_cast);
            }
        }
    }, [initialData]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        setUploading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/upload`, {
                method: 'POST',
                body: uploadData,
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, poster_url: data.url }));
            } else {
                alert('Lỗi khi upload ảnh: ' + data.message);
            }
        } catch (error) {
            alert('Lỗi kết nối khi upload ảnh.');
        } finally {
            setUploading(false);
        }
    };

    const handleAddCast = () => {
        if (!selectedArtistId) {
            alert('Vui lòng chọn nghệ sĩ');
            return;
        }
        if (cast.find(c => c.artist_id === parseInt(selectedArtistId))) {
            alert('Nghệ sĩ này đã được thêm vào danh sách');
            return;
        }
        const artist = artists.find(a => a.id === parseInt(selectedArtistId));
        setCast(prev => [...prev, {
            artist_id: parseInt(selectedArtistId),
            artist_name: artist?.name || '',
            character_name: characterName
        }]);
        setSelectedArtistId('');
        setCharacterName('');
    };

    const handleRemoveCast = (artistId) => {
        setCast(prev => prev.filter(c => c.artist_id !== artistId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, cast });
    };

    const fieldLabel = (label, icon) => (
        <label className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
        </label>
    );

    const inputCls = "w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400";
    const blockCls = "bg-white p-6 rounded-xl border border-gray-100 shadow-sm";
    const blockTitleCls = "text-sm font-bold text-gray-800 uppercase tracking-wider mb-6 flex items-center gap-3";
    const iconWrapperCls = "w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── LEFT: Poster ── */}
                <div className="lg:col-span-4">
                    <div className={`${blockCls} sticky top-8`}>
                        <h3 className={blockTitleCls}>
                            <div className={iconWrapperCls}><FaImage /></div>
                            Poster vở diễn
                        </h3>
                        
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 group hover:border-red-400 transition-all duration-300 mb-6 shadow-inner">
                            {formData.poster_url ? (
                                <>
                                    <img
                                        src={formData.poster_url}
                                        alt="Poster preview"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={e => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster'; }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                        <label className="cursor-pointer bg-white text-gray-900 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all shadow-sm flex items-center gap-2">
                                            <FaUpload /> Thay đổi ảnh
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-6 text-center group-hover:bg-red-50/50 transition-colors">
                                    <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center mb-4 text-gray-300 group-hover:text-red-500 transition-colors border border-gray-100">
                                        <FaUpload className="text-xl" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-red-600 transition-colors">
                                        {uploading ? 'Đang tải lên...' : 'Nhấn để tải poster'}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-2">Tỷ lệ 3:4 (Dọc)</span>
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            )}
                        </div>

                        {/* Poster URL input */}
                        <div className="space-y-1">
                            {fieldLabel('Hoặc dán URL ảnh')}
                            <input
                                type="text"
                                value={formData.poster_url}
                                onChange={e => setFormData({ ...formData, poster_url: e.target.value })}
                                placeholder="https://..."
                                className={`${inputCls} py-3 text-xs`}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-4 text-center">
                            Định dạng hỗ trợ: JPG, PNG, WebP (≤ 5MB)
                        </p>
                    </div>
                </div>

                {/* ── RIGHT: All fields ── */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Block 1: Basic Info */}
                    <div className={blockCls}>
                        <h3 className={blockTitleCls}>
                            <div className={iconWrapperCls}><FaTheaterMasks /></div>
                            Thông tin cơ bản
                        </h3>

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                {fieldLabel('Tên vở diễn *')}
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="VD: Romeo và Juliet, Hamlet..."
                                    className={`${inputCls} text-lg`}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Type */}
                                <div>
                                    {fieldLabel('Thể loại', <FaTag className="text-[10px]" />)}
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            className={`${inputCls} appearance-none cursor-pointer pr-10`}
                                        >
                                            {PERFORMANCE_TYPES.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    {fieldLabel('Thời lượng (phút)', <FaClock className="text-[10px]" />)}
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                        className={inputCls}
                                        min="1"
                                        max="600"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                {fieldLabel('Trạng thái hoạt động')}
                                <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
                                    {[
                                        { value: 'active', label: 'Đang công diễn', activeColor: 'bg-green-600 text-white shadow-sm' },
                                        { value: 'inactive', label: 'Tạm ngưng', activeColor: 'bg-gray-800 text-white shadow-sm' },
                                    ].map(opt => {
                                        const isActive = formData.status === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status: opt.value })}
                                                className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all duration-300 ${
                                                    isActive 
                                                        ? opt.activeColor 
                                                        : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-white'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                {fieldLabel('Nội dung / Cốt truyện')}
                                <textarea
                                    rows="5"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả cốt truyện, đạo diễn, các điểm nổi bật của vở diễn..."
                                    className={`${inputCls} leading-relaxed resize-none`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Block 3: Cast / Artists */}
                    <div className={blockCls}>
                        <h3 className={blockTitleCls}>
                            <div className={iconWrapperCls}><FaUsers /></div>
                            Dàn diễn viên (Liên kết nghệ sĩ)
                        </h3>

                        {/* Add artist row */}
                        <div className="flex flex-wrap items-end gap-4 p-5 bg-gray-50/80 rounded-xl border border-gray-200 mb-6">
                            <div className="flex-1 min-w-[200px]">
                                {fieldLabel('Chọn nghệ sĩ')}
                                <div className="relative">
                                    <select
                                        value={selectedArtistId}
                                        onChange={e => setSelectedArtistId(e.target.value)}
                                        className={`${inputCls} appearance-none cursor-pointer pr-10`}
                                    >
                                        <option value="">-- Chọn nghệ sĩ --</option>
                                        {artists.map(a => (
                                            <option key={a.id} value={a.id}>
                                                {a.name} {a.role_type ? `(${a.role_type})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                </div>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                {fieldLabel('Tên nhân vật')}
                                <input
                                    type="text"
                                    value={characterName}
                                    onChange={e => setCharacterName(e.target.value)}
                                    placeholder="VD: Hamlet, Nhân vật chính..."
                                    className={inputCls}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddCast}
                                className="h-[46px] px-6 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                            >
                                <FaUserPlus /> Thêm
                            </button>
                        </div>

                        {/* Cast list */}
                        {cast.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                                <FaUsers className="text-3xl text-gray-300 mx-auto mb-3" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Chưa có nghệ sĩ nào trong dàn diễn viên
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {cast.map((c, idx) => (
                                    <div key={c.artist_id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-sm font-black shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-gray-900 leading-tight truncate">{c.artist_name}</p>
                                            <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                                                {c.character_name || 'Chưa ghi nhân vật'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCast(c.artist_id)}
                                            className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Xóa khỏi dàn diễn"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <FaTimes /> Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-all active:scale-95 shadow-sm"
                        >
                            <FaSave className="text-lg" /> {isUpdating ? 'Lưu thay đổi' : 'Tạo vở diễn'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PerformanceForm;
