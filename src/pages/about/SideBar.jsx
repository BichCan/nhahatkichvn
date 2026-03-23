export default function SideBar(){
    return <aside className="w-[30%] md:w-1/5 bg-white border-r border-gray-200 p-2 shadow-sm">
        <ul className="flex flex-col gap-2">
          <li>
            <a href="/gioi-thieu/lich-su" className="block px-2 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-700 font-medium">
              Lịch sử hình thành
            </a>
          </li>
          <li>
            <a href="/gioi-thieu/chuc-nang" className="block px-2 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-700 font-medium">
              Chức năng nhiệm vụ
            </a>
          </li>
          <li>
            <a href="/gioi-thieu/to-chuc" className="block px-2 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-700 font-medium">
              Sơ đồ tổ chức
            </a>
          </li>
          <li>
            <a href="/gioi-thieu/co-so-vat-chat" className="block px-2 py-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-700 font-medium">
              Cơ sở vật chất
            </a>
          </li>
        </ul>
      </aside>
}