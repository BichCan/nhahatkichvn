import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [q, setQ] = useState("");
    const [results, setResults] = useState({ performances: [], artists: [], news: [] });
    const [open, setOpen] = useState(false);
    const [portalStyle, setPortalStyle] = useState(null);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [performancesdata, setPerformancesData] = useState([]);
    const [artistsData, setArtistsData] = useState([]);
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch('http://127.0.0.1:5000/api/performances').then(r => r.json()),
            fetch('http://127.0.0.1:5000/api/artists').then(r => r.json()),
            fetch('http://127.0.0.1:5000/api/news').then(r => r.json()),
        ]).then(([perfData, artData, nwData]) => {
            setPerformancesData(perfData);
            setArtistsData(artData);
            setNewsData(nwData);
        }).catch(err => console.error("Error fetching data:", err));
    }, []);

    // immediate search on every change (no debounce)
    useEffect(() => {
        const term = q.trim().toLowerCase();
        if (!term) {
            setResults({ performances: [], artists: [], news: [] });
            setOpen(false);
            return;
        }

        const performances = performancesdata
            .filter(p => p.name && p.name.toLowerCase().includes(term))
            .slice(0, 6);

        const artists = artistsData
            .filter(a => a.name && a.name.toLowerCase().includes(term))
            .slice(0, 6);

        const news = newsData
            .filter(n => n.title && n.title.toLowerCase().includes(term))
            .slice(0, 6);

        setResults({ performances, artists, news });
        setOpen(true);
    }, [q, performancesdata, artistsData, newsData]);

    // compute portal position so dropdown appears right under the input and above everything
    const updatePortalPosition = () => {
        const el = inputRef.current;
        if (!el) return setPortalStyle(null);
        const rect = el.getBoundingClientRect();
        setPortalStyle({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
            width: rect.width
        });
    };

    useLayoutEffect(() => {
        if (open) updatePortalPosition();
    }, [open, q]);

    useEffect(() => {
        const onResize = () => open && updatePortalPosition();
        const onScroll = () => open && updatePortalPosition();
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    useEffect(() => {
        // close on outside click
        function onClick(e) {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                // if click is outside input, also check if click is outside portal container by id
                const portalEl = document.getElementById("search-portal");
                if (!portalEl || !portalEl.contains(e.target)) setOpen(false);
            }
        }
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    const onSelectPerformance = (p) => {
        setOpen(false);
        setQ("");
        navigate("/vo-dien", { state: { openPerformanceId: p.id } });
    };

    const onSelectArtist = (a) => {
        setOpen(false);
        setQ("");
        navigate(`/nghe-si/${a.id}`);
    };

    const onSelectNews = (n) => {
        setOpen(false);
        setQ("");
        navigate(`/tin-tuc/${n.id}`);
    };

    const dropdown = (
        <div
            id="search-portal"
            style={{
                position: "absolute",
                top: portalStyle?.top ?? 0,
                left: portalStyle?.left ?? 0,
                width: portalStyle?.width ?? 300,
                zIndex: 9999
            }}
            className="text-white"
        >
            <div className="bg-black text-white rounded-xl shadow-lg border border-gray-800 max-h-72 overflow-auto">
                <div className="p-3">
                    {(results.performances.length === 0 && results.artists.length === 0 && results.news.length === 0) ? (
                        <div className="text-sm text-gray-400">Không có kết quả</div>
                    ) : (
                        <>
                            {results.performances.length > 0 && (
                                <div>
                                    <div className="text-xs text-gray-400 uppercase mb-2">Vở diễn</div>
                                    <ul className="space-y-1 mb-3">
                                        {results.performances.map(p => (
                                            <li key={p.id}>
                                                <button
                                                    onClick={() => onSelectPerformance(p)}
                                                    className="w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-800"
                                                >
                                                    {p.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {results.artists.length > 0 && (
                                <div>
                                    <div className="text-xs text-gray-400 uppercase mb-2">Nghệ sĩ</div>
                                    <ul className="space-y-1 mb-3">
                                        {results.artists.map(a => (
                                            <li key={a.id}>
                                                <button
                                                    onClick={() => onSelectArtist(a)}
                                                    className="w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-800"
                                                >
                                                    {a.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {results.news.length > 0 && (
                                <div>
                                    <div className="text-xs text-gray-400 uppercase mb-2">Tin tức</div>
                                    <ul className="space-y-1">
                                        {results.news.map(n => (
                                            <li key={n.id}>
                                                <button
                                                    onClick={() => onSelectNews(n)}
                                                    className="w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-800"
                                                >
                                                    {n.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="relative w-full max-w-2xl px-4">
                <div className="relative">
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onFocus={() => { if (q.trim()) setOpen(true); updatePortalPosition(); }}
                        type="text"
                        placeholder="Tìm kiếm vở diễn / nghệ sĩ / tin tức..."
                        className="w-full h-12 pl-4 pr-12 rounded-full bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none"
                        aria-label="Search"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white p-2"
                        aria-label="Search"
                        onClick={() => { if (q.trim()) setOpen(true); updatePortalPosition(); }}
                    >
                        <FaSearch />
                    </button>
                </div>
            </div>

            {open && portalStyle && createPortal(dropdown, document.body)}
        </>
    );
}