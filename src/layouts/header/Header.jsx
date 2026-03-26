import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    return (
        <header className="relative bg-black text-white w-full h-16 flex items-center justify-between px-4">
            <div className="flex flex-col">
                <div className="font-bold">
                NHÀ HÁT KỊCH
                </div>
                <div className="font-bold">
                VIỆT NAM
                </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 px-4">
                <SearchBar />
            </div>

            <div className="flex items-center gap-3">
                <UserMenu />
                <button
                    onClick={() => navigate("/dat-ve")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                    ĐẶT VÉ
                </button>
            </div>
        </header>
    );
}