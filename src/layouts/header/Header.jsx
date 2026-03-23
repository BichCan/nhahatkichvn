import logo from "../../logo.jpg"
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useNavigate } from "react-router-dom";
export default function Header() {
    const navigate = useNavigate();
    return (
        <header className="flex bg-[#2C2B29] min-w-screen h-16 justify-between mx-auto">
            <img src={logo} alt="Logo"
            onClick={() =>navigate("/")}
            />
            <SearchBar />
            <UserMenu />
        </header>
    );
}