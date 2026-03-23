import { useState } from "react";
import { FaSearch } from "react-icons/fa";
export default function SearchBar() {
    return (
        <div className="flex items-center px-auto bg-white m-3">
            <input className="h-10 w-[80%] sm:w-100%] px-4 center placeholder:my-auto focus:outline-none" type="text" placeholder="Search" />
            <button type="submit" className="text-white bg-black px-6 py-3 decoration-none"><FaSearch /></button> 
        </div>
    );
}