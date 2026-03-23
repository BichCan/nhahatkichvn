import React from 'react';
import { useParams, Link } from 'react-router-dom';
import artistsData from '../../data/ArtistsData';

export default function ArtistDetail() {
    const { artistId } = useParams();
    const artist = artistsData.find(a => a.id === parseInt(artistId));

    if (!artist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy nghệ sĩ</h2>
                    <Link to="/nghe-si" className="text-[#7a2323] hover:underline">← Quay lại danh sách</Link>
                </div>
            </div>
        );
    }

    // Helper: render section title
    const SectionTitle = ({ children }) => (
        <h2 className="text-xl font-bold text-[#5a1a1a] mb-4 mt-8 border-b-2 border-[#5a1a1a]/20 pb-2 uppercase tracking-wide text-sm">
            {children}
        </h2>
    );

    // Helper: render education (string hoặc array)
    const renderEducation = () => {
        if (!artist.education) return null;
        if (typeof artist.education === 'string') {
            return <p className="text-gray-700 text-sm">{artist.education}</p>;
        }
        if (Array.isArray(artist.education)) {
            return (
                <ul className="space-y-1">
                    {artist.education.map((edu, i) => (
                        <li key={i} className="text-gray-700 text-sm">
                            <span className="font-semibold text-gray-800">{edu.period}:</span> {edu.school}
                            {edu.major && <span className="text-gray-500"> — {edu.major}</span>}
                        </li>
                    ))}
                </ul>
            );
        }
        return null;
    };

    // Helper: render films (string[] hoặc object[])
    const renderFilms = () => {
        if (!artist.films || artist.films.length === 0) return null;
        return (
            <ul className="space-y-1.5">
                {artist.films.map((film, i) => {
                    if (typeof film === 'string') {
                        return <li key={i} className="text-gray-700 text-sm">• {film}</li>;
                    }
                    return (
                        <li key={i} className="text-gray-700 text-sm">
                            • {film.year && <span className="font-semibold">{film.year} — </span>}
                            {film.title}
                            {film.role && <span className="text-gray-500"> (vai {film.role})</span>}
                            {film.director && <span className="text-gray-500"> — ĐD: {film.director}</span>}
                            {film.achievement && <span className="text-amber-600 ml-1">🏆 {film.achievement}</span>}
                        </li>
                    );
                })}
            </ul>
        );
    };

    // Helper: render stagePlays (string[] hoặc object[])
    const renderStagePlays = () => {
        if (!artist.stagePlays || artist.stagePlays.length === 0) return null;
        return (
            <ul className="space-y-1.5">
                {artist.stagePlays.map((play, i) => {
                    if (typeof play === 'string') {
                        return <li key={i} className="text-gray-700 text-sm">• {play}</li>;
                    }
                    return (
                        <li key={i} className="text-gray-700 text-sm">
                            • {play.year && <span className="font-semibold">{play.year} — </span>}
                            {play.title}
                            {play.author && <span className="text-gray-500"> — TG: {play.author}</span>}
                            {play.director && <span className="text-gray-500"> — ĐD: {play.director}</span>}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="min-h-screen bg-[#fdf8f0]">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <Link to="/nghe-si" className="text-[#7a2323] hover:underline">Nghệ sĩ</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-600">{artist.name}</span>
                </nav>

                {/* Hero: Ảnh + Bio chính */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Ảnh nhỏ bên trái (1/4 chiều rộng) */}
                    <div className="md:w-1/4 shrink-0">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={artist.avatar}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                                }}
                            />
                        </div>
                    </div>

                    {/* Nội dung bên phải */}
                    <div className="flex-1">
                        {/* Tên */}
                        <h1 className="text-3xl font-bold text-[#5a1a1a] mb-1">
                            {artist.name}
                        </h1>

                        {/* Danh hiệu */}
                        {artist.titles && artist.titles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {artist.titles.map((t, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                        {t.name} {t.year && `(${t.year})`}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Chức vụ */}
                        {artist.positions && artist.positions.length > 0 && (
                            <p className="text-gray-600 text-sm mb-3 italic">
                                {artist.positions.map(p => `${p.title} — ${p.organization}`).join(' | ')}
                            </p>
                        )}

                        {/* Bio heading */}
                        <h2 className="text-lg font-bold text-[#5a1a1a] mt-4 mb-2">Về Nghệ Sĩ</h2>

                        {/* Bio text */}
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                            {artist.bio}
                        </p>

                        {/* Quote */}
                        {artist.quote && (
                            <blockquote className="mt-4 pl-4 border-l-4 border-[#c94a4a] italic text-gray-600 text-sm leading-relaxed">
                                "{artist.quote}"
                            </blockquote>
                        )}

                        {/* Philosophy */}
                        {artist.philosophy && (
                            <p className="mt-3 text-gray-600 text-sm italic">
                                💡 {artist.philosophy}
                            </p>
                        )}

                        {/* Style */}
                        {artist.style && (
                            <p className="mt-3 text-gray-600 text-sm">
                                🎭 <span className="font-semibold">Phong cách:</span> {artist.style}
                            </p>
                        )}
                    </div>
                </div>

                {/* ==================== CÁC SECTION CHI TIẾT ==================== */}

                {/* Thông tin cá nhân */}
                <SectionTitle>Thông tin cá nhân</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    {artist.fullName && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Họ và tên:</span><span className="text-gray-800 font-medium">{artist.fullName}</span></div>
                    )}
                    {artist.birthDate && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Ngày sinh:</span><span className="text-gray-800 font-medium">{artist.birthDate}</span></div>
                    )}
                    {artist.birthYear && !artist.birthDate && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Năm sinh:</span><span className="text-gray-800 font-medium">{artist.birthYear}</span></div>
                    )}
                    {artist.birthPlace && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Quê quán:</span><span className="text-gray-800 font-medium">{artist.birthPlace}</span></div>
                    )}
                    {artist.location && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Nơi sống:</span><span className="text-gray-800 font-medium">{artist.location}</span></div>
                    )}
                    {artist.yearsActive && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Năm hoạt động:</span><span className="text-gray-800 font-medium">{artist.yearsActive} năm</span></div>
                    )}
                    {artist.organization && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Nơi công tác:</span><span className="text-gray-800 font-medium">{artist.organization}</span></div>
                    )}
                    {artist.position && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Chức vụ:</span><span className="text-gray-800 font-medium">{artist.position}</span></div>
                    )}
                    {artist.workPeriod && (
                        <div className="flex gap-2 text-sm"><span className="text-gray-500 w-32 shrink-0">Thời gian:</span><span className="text-gray-800 font-medium">{artist.workPeriod}</span></div>
                    )}
                </div>

                {/* Học vấn */}
                {artist.education && (
                    <>
                        <SectionTitle>Học vấn</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            {renderEducation()}
                        </div>
                    </>
                )}

                {/* Quá trình công tác */}
                {artist.workHistory && artist.workHistory.length > 0 && (
                    <>
                        <SectionTitle>Quá trình công tác</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-2">
                                {artist.workHistory.map((w, i) => (
                                    <li key={i} className="text-gray-700 text-sm flex gap-2">
                                        <span className="font-semibold text-gray-800 shrink-0">{w.period}:</span>
                                        <span>{w.position} — {w.organization || w.department}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Chức vụ chi tiết */}
                {artist.positions && artist.positions.length > 0 && (
                    <>
                        <SectionTitle>Chức vụ</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-2">
                                {artist.positions.map((p, i) => (
                                    <li key={i} className="text-gray-700 text-sm">
                                        • <span className="font-semibold">{p.title}</span> — {p.organization}
                                        {p.period && <span className="text-gray-500 ml-1">({p.period})</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Vai diễn nổi bật */}
                {artist.notableRoles && artist.notableRoles.length > 0 && (
                    <>
                        <SectionTitle>Vai diễn nổi bật</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-2">
                                {artist.notableRoles.map((r, i) => (
                                    <li key={i} className="text-gray-700 text-sm">
                                        • <span className="font-semibold">{r.role}</span>
                                        {r.production && <span className="text-gray-500"> — {r.production}</span>}
                                        {r.count && <span className="text-gray-500"> ({r.count} lần)</span>}
                                        {r.description && <p className="text-gray-500 text-xs ml-3 mt-0.5">{r.description}</p>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Vở kịch sân khấu */}
                {artist.stagePlays && artist.stagePlays.length > 0 && (
                    <>
                        <SectionTitle>Vở kịch sân khấu</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            {renderStagePlays()}
                        </div>
                    </>
                )}

                {/* Phim */}
                {artist.films && artist.films.length > 0 && (
                    <>
                        <SectionTitle>Phim đã tham gia</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            {renderFilms()}
                        </div>
                    </>
                )}

                {/* Chương trình truyền hình */}
                {artist.tvShows && artist.tvShows.length > 0 && (
                    <>
                        <SectionTitle>Chương trình truyền hình</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-1.5">
                                {artist.tvShows.map((show, i) => (
                                    <li key={i} className="text-gray-700 text-sm">
                                        • <span className="font-semibold">{show.show}</span>
                                        {show.role && <span className="text-gray-500"> — {show.role}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Lồng tiếng */}
                {artist.voiceWork && artist.voiceWork.length > 0 && (
                    <>
                        <SectionTitle>Lồng tiếng</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-1">
                                {artist.voiceWork.map((v, i) => (
                                    <li key={i} className="text-gray-700 text-sm">• {v}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Thành tích */}
                {artist.achievements && artist.achievements.length > 0 && (
                    <>
                        <SectionTitle>Thành tích & Giải thưởng</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-2">
                                {artist.achievements.map((a, i) => (
                                    <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                                        <span className="text-amber-500">🏆</span>
                                        <div>
                                            {a.year && <span className="font-semibold text-gray-800">{a.year}: </span>}
                                            {a.achievement}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Giải tập thể */}
                {artist.groupAchievements && artist.groupAchievements.length > 0 && (
                    <>
                        <SectionTitle>Giải thưởng tập thể</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-2">
                                {artist.groupAchievements.map((a, i) => (
                                    <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                                        <span className="text-amber-500">🥇</span>
                                        <div>
                                            {a.year && <span className="font-semibold text-gray-800">{a.year}: </span>}
                                            {a.achievement}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Sự kiện quan trọng */}
                {artist.milestones && artist.milestones.length > 0 && (
                    <>
                        <SectionTitle>Sự kiện quan trọng</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-2">
                                {artist.milestones.map((m, i) => (
                                    <li key={i} className="text-gray-700 text-sm flex gap-2">
                                        <span className="font-semibold text-gray-800 shrink-0">{m.date}:</span>
                                        <span>{m.event}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Hoạt động khác */}
                {artist.otherActivities && artist.otherActivities.length > 0 && (
                    <>
                        <SectionTitle>Hoạt động khác</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <ul className="space-y-1">
                                {artist.otherActivities.map((a, i) => (
                                    <li key={i} className="text-gray-700 text-sm">• {a}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {/* Quotes (array) */}
                {artist.quotes && artist.quotes.length > 0 && (
                    <>
                        <SectionTitle>Câu nói đáng nhớ</SectionTitle>
                        <div className="space-y-3">
                            {artist.quotes.map((q, i) => (
                                <blockquote key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 pl-5 border-l-4 border-l-[#c94a4a] italic text-gray-600 text-sm">
                                    "{q}"
                                </blockquote>
                            ))}
                        </div>
                    </>
                )}

                {/* Social */}
                {artist.social && (
                    <>
                        <SectionTitle>Mạng xã hội</SectionTitle>
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            {artist.social.facebook && (
                                <a href={artist.social.facebook} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm">
                                    📘 Facebook
                                </a>
                            )}
                        </div>
                    </>
                )}

                {/* Back link */}
                <div className="text-center mt-10 mb-4">
                    <Link
                        to="/nghe-si"
                        className="text-sm text-gray-500 hover:text-[#5a1a1a] transition-colors font-medium"
                    >
                        ← Quay lại danh sách nghệ sĩ
                    </Link>
                </div>
            </div>
        </div>
    );
}
