import React from 'react';

export default function PopupCash({ onSubmit }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-bold mb-2">Xác nhận thanh toán bằng tiền mặt</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Lưu ý: Vé sẽ bị hủy bỏ sau 24h nếu không thanh toán
                </p>
                <div className="flex justify-end gap-3">
                    {/* <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
                    >
                        Hủy
                    </button> */}
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                    >
                        Xác nhận đã giữ vé!
                    </button>
                </div>
            </div>
        </div>
    );
}
