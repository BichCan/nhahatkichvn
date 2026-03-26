import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <nav className="bg-black border-b border-gray-800 min-w-full relative text-white">
            <div className="max-w-6xl mx-auto py-3 sm:py-2 flex flex-col sm:flex-row items-center justify-between ">
                <div className="sm:hidden flex items-center justify-center h-5">
                    <button onClick={() => setOpenMenu(!openMenu)} className="text-2xl py-8 text-white z-[10]">
                        {openMenu ? <IoMdClose /> : <IoMdMenu />}
                    </button>
                </div>
                <ul
                    className={`${openMenu ? "flex-col" : "hidden"} sm:flex flex-col sm:flex-row absolute sm:relative z-[1] mx-auto left-0 px-5 top-8 sm:top-0
                        w-full sm:w-auto bg-black sm:bg-transparent border-b sm:border-none border-gray-800
                        justify-center items-center sm:gap-7 md:gap-12 py-2 sm:py-1
                        text-base font-medium text-white pb-4`}
                >
                    <li name="trang-chu" className="relative group pt-3 sm:py-0 w-fit">
                        <a href="/" className="hover:text-red-600 transition">
                            Trang chủ
                        </a>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-600 transition-all group-hover:w-full"></span>
                    </li>

                    <li className="relative group w-fit pt-3 sm:py-0">
                        <a href="/gioi-thieu/lich-su" className="hover:text-red-600 transition flex items-center">
                            Giới thiệu
                            <IoIosArrowDown className="ml-1 text-xs transition-transform duration-500 ease-in-out group-hover:rotate-180 hidden sm:inline" />
                        </a>
                        <ul className="absolute left-4 gap-4 top-full w-48 bg-black border border-gray-800 shadow-xl rounded-md 
                           opacity-0 invisible translate-y-2 transition-all duration-300 
                           sm:group-hover:opacity-100 sm:group-hover:visible sm:group-hover:translate-y-3 z-50 ">
                            <li>
                                <a href="/gioi-thieu/lich-su" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Lịch sử hình thành
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/chuc-nang" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Chức năng nhiệm vụ
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/to-chuc" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Sơ đồ tổ chức
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/co-so-vat-chat" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Cơ sở vật chất
                                </a>
                            </li>
                        </ul>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-600 transition-all group-hover:w-full"></span>
                    </li>

                    <li className="relative group w-fit pt-3 sm:py-0">
                        <a href="/tin-tuc" className="hover:text-red-600 transition flex items-center">
                            Tin tức
                            <IoIosArrowDown className="ml-1 text-xs transition-transform duration-500 ease-in-out group-hover:rotate-180 hidden sm:inline" />
                        </a>
                        <ul className="absolute left-0 top-full w-48 bg-black border border-gray-800 shadow-xl rounded-md 
                           opacity-0 invisible translate-y-2 transition-all duration-300 
                           sm:group-hover:opacity-100 sm:group-hover:visible sm:group-hover:translate-y-3 z-50 ">
                            <li>
                                <a href="/gioi-thieu/bieu-dien-nghe-thuat" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Tin tức biểu diễn nghệ thuật
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/tin-tuc-bao-chi" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Tin tức báo chí
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/hoat-dong-nha-hat" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Các hoạt động của nhà hát
                                </a>
                            </li>
                        </ul>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-600 transition-all group-hover:w-full"></span>
                    </li>

                    <li className="relative group w-fit pt-3 sm:py-0">
                        <a href="/vo-dien" className="hover:text-red-600 transition">
                            Vở diễn
                        </a>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-600 transition-all group-hover:w-full"></span>
                    </li>

                    <li className="relative group w-fit pt-3 sm:py-0">
                        <a href="/nghe-si" className="hover:text-red-600 transition flex items-center">
                            Nghệ sĩ
                            <IoIosArrowDown className="ml-1 text-xs transition-transform duration-500 ease-in-out group-hover:rotate-180 hidden sm:inline" />
                        </a>
                        <ul className="absolute left-0 top-full w-48 bg-black border border-gray-800 shadow-xl rounded-md 
                           opacity-0 invisible translate-y-2 transition-all duration-300 
                           sm:group-hover:opacity-100 sm:group-hover:visible sm:group-hover:translate-y-3 z-50 ">
                            <li>
                                <a href="/gioi-thieu/ban-giam-doc" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Ban Giám đốc
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/doan-kich-co-dien" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Đoàn kịch cổ điển
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/doan-kich-duong-dai" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Đoàn kịch đương đại
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/nghe-si-nghi-che-do" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Nghệ sĩ nghỉ chế độ
                                </a>
                            </li>
                            <li>
                                <a href="/gioi-thieu/co-nghe-si" className="block px-4 py-2 hover:bg-gray-800 hover:text-red-600 transition">
                                    Cố nghệ sĩ
                                </a>
                            </li>
                        </ul>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-600 transition-all group-hover:w-full"></span>
                    </li>

                    <li className="relative group w-fit pt-3 sm:py-0">
                        <a href="/gop-y" className="hover:text-red-600 transition">
                            Góp ý
                        </a>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-red-600 transition-all group-hover:w-full"></span>
                    </li>
                </ul>
            </div>
        </nav>
    );
}