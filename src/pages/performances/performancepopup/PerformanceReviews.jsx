import React, { useState, useEffect, useCallback } from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function PerformanceReviews({ performanceId }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [newRating, setNewRating] = useState(5);
    const [newReview, setNewReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/ratings/${performanceId}`);
            const data = await response.json();
            setReviews(data.reviews || []);
            setAvgRating(data.avg || 0);
            setTotalCount(data.count || 0);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        }
    }, [performanceId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    performance_id: performanceId,
                    rating: newRating,
                    review: newReview
                }),
                credentials: 'include'
            });

            if (response.status === 401) {
                alert("Vui lòng đăng nhập để gửi nhận xét.");
                navigate('/login');
                return;
            }

            const data = await response.json();
            if (data.success) {
                setNewReview('');
                setNewRating(5);
                fetchReviews();
                alert(data.message);
            } else {
                alert(data.message || "Gửi nhận xét thất bại");
            }
        } catch (err) {
            console.error("Error submitting review", err);
            alert("Lỗi kết nối máy chủ");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    s <= rating ? (
                        <StarIconSolid key={s} className="w-4 h-4 text-amber-400" />
                    ) : (
                        <StarIconOutline key={s} className="w-4 h-4 text-gray-300" />
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-serif font-bold text-[#8b1d21] mb-8">Đánh giá & Bình luận</h3>

            {/* Review Form */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-10">
                <h4 className="text-sm font-bold text-gray-700 mb-4 tracking-wide uppercase">Gửi đánh giá của bạn</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Đánh giá:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setNewRating(s)}
                                    className="focus:outline-none transition-transform active:scale-110"
                                >
                                    {s <= newRating ? (
                                        <StarIconSolid className="w-8 h-8 text-amber-400" />
                                    ) : (
                                        <StarIconOutline className="w-8 h-8 text-gray-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn về vở diễn..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8b1d21] min-h-[100px] transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#8b1d21] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#6e171a] transition-all disabled:opacity-50 shadow-lg shadow-[#8b1d21]/20"
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi nhận xét'}
                    </button>
                </form>
            </div>

            {/* Stats Summary */}
            {totalCount > 0 && (
                <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-50 shadow-sm">
                    <div className="text-4xl font-black text-gray-900">{avgRating}</div>
                    <div>
                        {renderStars(Math.round(avgRating))}
                        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Dựa trên {totalCount} lượt đánh giá
                        </div>
                    </div>
                </div>
            )}

            {/* Review List */}
            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev.id} className="p-6 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h5 className="font-bold text-gray-800 text-sm">{rev.reviewer}</h5>
                                {renderStars(rev.rating)}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed italic">"{rev.review}"</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm italic">Chưa có bình luận nào. Hãy là người đầu tiên đánh giá!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
