import React from "react";

const TicketTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ thanh toán" },
    { id: "success", label: "Thành công" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit shadow-sm border border-gray-100 backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold text-sm
            ${
              activeTab === tab.id
                ? "bg-[#5a1a1a] text-white shadow-lg shadow-[#5a1a1a]/20 scale-105"
                : "text-gray-500 hover:bg-white hover:text-[#5a1a1a]"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TicketTabs;
