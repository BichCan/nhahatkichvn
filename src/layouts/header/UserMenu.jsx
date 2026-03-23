import { FaUser } from "react-icons/fa";
import { useState } from "react";
export default function UserMenu(){
    const [open, setOpen] = useState(false);
    return(
        <div className="relative">
            <button onClick={()=>{ setOpen(!open)}}>
                <FaUser className="text-white m-3 my-4 size-8 rounded-full cursor-pointer justify-between hover:bg-[#757575]"/>
            </button>
            {open && (
                <div className="absolute overflow-hidden right-0 w-48 bg-white rounded-md shadow-lg z-20">
                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Thông tin tài khoản</a>
                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Cài đặt</a>
                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Đăng xuất</a>
                </div>
            )}
        </div>
    )
}