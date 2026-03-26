import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function UserMenu(){
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return(
        <div className="relative">
            <button onClick={() => { setOpen(!open); }} className="p-2 rounded-full hover:bg-gray-700">
                <FaUser className="text-white" />
            </button>
            {open && (
                <div className="absolute overflow-hidden right-0 w-48 bg-black text-white rounded-md shadow-lg z-20 border border-gray-800">
                    <button onClick={() => { setOpen(false); navigate('/thong-tin-dat-ve'); }} className="w-full text-left px-4 py-2 hover:bg-gray-800">Thông tin đặt vé</button>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-800">Thông tin tài khoản</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-800">Cài đặt</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-800">Đăng xuất</a>
                </div>
            )}
        </div>
    );
}