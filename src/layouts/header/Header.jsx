import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaTheaterMasks } from "react-icons/fa";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── nav data ─── */
const NAV_ITEMS = [
    { label: "Trang chủ", href: "/" },
    {
        label: "Giới thiệu",
        href: "/gioi-thieu/lich-su",
        children: [
            { label: "Lịch sử hình thành", href: "/gioi-thieu/lich-su" },
            { label: "Chức năng nhiệm vụ", href: "/gioi-thieu/chuc-nang" },
            { label: "Sơ đồ tổ chức", href: "/gioi-thieu/to-chuc" },
            { label: "Cơ sở vật chất", href: "/gioi-thieu/co-so-vat-chat" },
        ],
    },
    {
        label: "Tin tức",
        href: "/tin-tuc",
        children: [
            { label: "Tin tức biểu diễn nghệ thuật", href: "/gioi-thieu/bieu-dien-nghe-thuat" },
            { label: "Tin tức báo chí", href: "/gioi-thieu/tin-tuc-bao-chi" },
            { label: "Các hoạt động của nhà hát", href: "/gioi-thieu/hoat-dong-nha-hat" },
        ],
    },
    { label: "Vở diễn", href: "/vo-dien" },
    {
        label: "Nghệ sĩ",
        href: "/nghe-si",
        children: [
            { label: "Ban Giám đốc", href: "/gioi-thieu/ban-giam-doc" },
            { label: "Đoàn kịch cổ điển", href: "/gioi-thieu/doan-kich-co-dien" },
            { label: "Đoàn kịch đương đại", href: "/gioi-thieu/doan-kich-duong-dai" },
            { label: "Nghệ sĩ nghỉ chế độ", href: "/gioi-thieu/nghe-si-nghi-che-do" },
            { label: "Cố nghệ sĩ", href: "/gioi-thieu/co-nghe-si" },
        ],
    },
    { label: "Góp ý", href: "/gop-y" },
];

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSubOpen, setMobileSubOpen] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    /* close mobile menu on route change */
    useEffect(() => {
        setMobileOpen(false);
        setMobileSubOpen(null);
    }, [location.pathname]);

    /* detect scroll for shadow */
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    /* lock body when mobile menu open */
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const toggleMobileSub = (idx) =>
        setMobileSubOpen(mobileSubOpen === idx ? null : idx);

    return (
        <header
            className={`sticky top-0 z-[100] w-full transition-shadow duration-300 ${
                scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,.15)]" : ""
            }`}
        >
            {/* ════════ SINGLE ROW HEADER ════════ */}
            <div className="bg-[#D4BAB6]">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-6 h-16 lg:h-[64px]">

                    {/* ── Logo ── */}
                    <a
                        href="/"
                        className="flex items-center gap-2.5 group select-none shrink-0"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#800020] shadow-md group-hover:shadow-lg transition-shadow">
                            <FaTheaterMasks className="text-white text-lg" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-[12px] md:text-[13px] font-extrabold tracking-[.08em] text-[#800020]">
                                NHÀ HÁT KỊCH
                            </span>
                            <span className="text-[10px] md:text-[11px] font-bold tracking-[.14em] text-[#4a0012]">
                                VIỆT NAM
                            </span>
                        </div>
                    </a>

                    {/* ── Desktop Nav — same row ── */}
                    <nav className="hidden lg:flex items-center mx-4">
                        <ul className="flex items-center gap-0">
                            {NAV_ITEMS.map((item, idx) => (
                                <DesktopNavItem
                                    key={idx}
                                    item={item}
                                    isActive={location.pathname === item.href}
                                />
                            ))}
                        </ul>
                    </nav>

                    {/* ── Right side: search + user + booking + hamburger ── */}
                    <div className="flex items-center gap-2 shrink-0">
                        <SearchBar />
                        <UserMenu />

                        <button
                            onClick={() => navigate("/dat-ve")}
                            className="hidden sm:inline-flex items-center bg-[#800020] hover:bg-[#6b001a] text-white text-xs font-bold px-4 py-2 rounded-md tracking-wide transition-colors active:scale-95 shadow-md hover:shadow-lg"
                        >
                            ĐẶT VÉ
                        </button>

                        {/* Hamburger – mobile/tablet only */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden ml-0.5 p-2 rounded-md hover:bg-[#800020]/10 transition-colors text-[#800020]"
                            aria-label="Menu"
                        >
                            {mobileOpen ? (
                                <IoClose className="text-xl" />
                            ) : (
                                <HiOutlineMenuAlt3 className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ════════ MOBILE DRAWER ════════ */}
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-300 lg:hidden ${
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-[#D4BAB6] z-[201] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-[#800020]/15 shrink-0">
                    <span className="text-[#800020] font-bold tracking-wider text-sm">MENU</span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-md hover:bg-[#800020]/10 text-[#800020] transition-colors"
                        aria-label="Đóng menu"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                {/* Drawer body */}
                <div className="flex-1 overflow-y-auto py-2">
                    {NAV_ITEMS.map((item, idx) => (
                        <MobileNavItem
                            key={idx}
                            item={item}
                            idx={idx}
                            isSubOpen={mobileSubOpen === idx}
                            toggle={() => toggleMobileSub(idx)}
                            isActive={location.pathname === item.href}
                        />
                    ))}
                </div>

                {/* Drawer footer — booking CTA */}
                <div className="shrink-0 p-4 border-t border-[#800020]/15">
                    <button
                        onClick={() => { setMobileOpen(false); navigate("/dat-ve"); }}
                        className="w-full flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#6b001a] text-white text-sm font-bold py-3 rounded-md transition-colors active:scale-95 shadow-md"
                    >
                        ĐẶT VÉ NGAY
                    </button>
                </div>
            </div>
        </header>
    );
}

/* ─────────────── Desktop nav item ─────────────── */
function DesktopNavItem({ item, isActive }) {
    const hasChildren = item.children && item.children.length > 0;

    return (
        <li className="relative group">
            <a
                href={item.href}
                className={`relative flex items-center gap-1 px-3 xl:px-3.5 py-5 text-[12px] xl:text-[13px] font-semibold tracking-wide uppercase transition-colors duration-200 whitespace-nowrap
                    ${isActive
                        ? "text-[#800020]"
                        : "text-[#4a0012]/80 hover:text-[#800020]"
                    }`}
            >
                {item.label}
                {hasChildren && (
                    <IoIosArrowDown className="text-[10px] opacity-60 transition-transform duration-300 group-hover:rotate-180" />
                )}
                {/* hover / active underline */}
                <span
                    className={`absolute bottom-3 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#800020] transition-all duration-300 ${
                        isActive ? "w-3/4" : "w-0 group-hover:w-3/4"
                    }`}
                />
            </a>

            {/* Dropdown */}
            {hasChildren && (
                <ul className="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-56 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1">
                        {item.children.map((child, ci) => (
                            <a
                                key={ci}
                                href={child.href}
                                className="block px-5 py-2.5 text-sm text-gray-700 hover:text-[#800020] hover:bg-[#D4BAB6]/20 transition-colors"
                            >
                                {child.label}
                            </a>
                        ))}
                    </div>
                </ul>
            )}
        </li>
    );
}

/* ─────────────── Mobile nav item ─────────────── */
function MobileNavItem({ item, idx, isSubOpen, toggle, isActive }) {
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className="border-b border-[#800020]/10 last:border-none">
            <div className="flex items-center">
                <a
                    href={item.href}
                    className={`flex-1 px-5 py-3.5 text-sm font-semibold tracking-wide transition-colors ${
                        isActive ? "text-[#800020]" : "text-[#4a0012]/80 hover:text-[#800020]"
                    }`}
                >
                    {item.label}
                </a>
                {hasChildren && (
                    <button
                        onClick={toggle}
                        className="px-4 py-3.5 text-[#800020]/50 hover:text-[#800020] transition-colors"
                        aria-label="Mở mục con"
                    >
                        <IoIosArrowDown
                            className={`text-sm transition-transform duration-300 ${
                                isSubOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                )}
            </div>

            {/* Sub-items */}
            {hasChildren && (
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        isSubOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="bg-[#800020]/5 pl-8 pr-4 py-1">
                        {item.children.map((child, ci) => (
                            <a
                                key={ci}
                                href={child.href}
                                className="block py-2.5 text-[13px] text-[#4a0012]/60 hover:text-[#800020] transition-colors"
                            >
                                {child.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}