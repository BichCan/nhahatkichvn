import React, { useState } from 'react';
import seatsData from '../../../data/SeatsData';
import Stage from './Stage';
import SeatRow from './SeatRow';
import SeatLegend from './SeatLegend';
import SeatFooter from './SeatFooter';

export default function SeatMap({ onSeatsChange, maxSeats = 10, onSelectSeats }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]); 

    // Tính tổng tiền
    const calculateTotal = () => {
        return selectedSeats.reduce((total, seatId) => {
            const row = seatId.charAt(0);
            
            // Xác định loại ghế
            const isVipRow = ['C', 'D', 'E'].includes(row) || 
                            seatsData.secondaryRows.default.includes(row) ||
                            seatsData.secondaryRows.extended.includes(row);
            
            const price = isVipRow 
                ? seatsData.seatTypes.blue.price 
                : seatsData.seatTypes.gray.price;
            
            return total + price;
        }, 0);
    };

    // Kiểm tra ghế đã được đặt chưa
    const isSeatOccupied = (row, number) => {
        const seatId = `${row}${number}`;
        return occupiedSeats.includes(seatId);
    };

    // Xử lý chọn/bỏ chọn ghế
    const handleSeatSelect = (row, number) => {
        const seatId = `${row}${number}`;
        if (isSeatOccupied(row, number)) {
            alert('Ghế này đã có người đặt!');
            return;
        }
        
        setSelectedSeats(prev => {
            let newSelected;
            if (prev.includes(seatId)) {
                newSelected = prev.filter(s => s !== seatId);
            } else {
                if (prev.length >= maxSeats) {
                    alert(`Bạn chỉ có thể chọn tối đa ${maxSeats} ghế!`);
                    return prev;
                }
                newSelected = [...prev, seatId];
            }
            
            // Truyền thông tin chi tiết ghế lên BookingPage
            const seatsInfo = newSelected.map(id => {
                const r = id.charAt(0);
                const num = parseInt(id.slice(1));
                const isVip = ['C', 'D', 'E'].includes(r) || 
                             seatsData.secondaryRows.default.includes(r) ||
                             seatsData.secondaryRows.extended.includes(r);
                const price = isVip 
                    ? seatsData.seatTypes.blue.price 
                    : seatsData.seatTypes.gray.price;
                return {
                    id,
                    row: r,
                    number: num,
                    type: isVip ? 'vip' : 'regular',
                    price
                };
            });
            onSelectSeats(seatsInfo);

            if (onSeatsChange) {
                onSeatsChange({
                    seats: newSelected,
                    total: calculateTotalWithNewList(newSelected)
                });
            }
            
            return newSelected;
        });
    };

    // Tính tổng tiền với danh sách ghế mới
    const calculateTotalWithNewList = (seatList) => {
        return seatList.reduce((total, seatId) => {
            const row = seatId.charAt(0);
            const isVipRow = ['C', 'D', 'E'].includes(row) || 
                            seatsData.secondaryRows.default.includes(row) ||
                            seatsData.secondaryRows.extended.includes(row);
            const price = isVipRow 
                ? seatsData.seatTypes.blue.price 
                : seatsData.seatTypes.gray.price;
            return total + price;
        }, 0);
    };

    // Xóa tất cả ghế đã chọn
    const clearSelectedSeats = () => {
        setSelectedSeats([]);
        if (onSeatsChange) {
            onSeatsChange({ seats: [], total: 0 });
        }
    };

    // Lấy thông tin chi tiết của ghế đã chọn
    const getSelectedSeatsInfo = () => {
        return selectedSeats.map(seatId => {
            const row = seatId.charAt(0);
            const number = parseInt(seatId.slice(1));
            const isVip = ['C', 'D', 'E'].includes(row) || 
                         seatsData.secondaryRows.default.includes(row) ||
                         seatsData.secondaryRows.extended.includes(row);
            const price = isVip 
                ? seatsData.seatTypes.blue.price 
                : seatsData.seatTypes.gray.price;   
            const seat = {
                id: seatId,
                row,
                number,
                type: isVip ? 'vip' : 'regular',
                price
            }
            return {
                id: seatId,
                row,
                number,
                type: isVip ? 'vip' : 'regular',
                price
            };
        });
    };

    // Kiểm tra ghế có được chọn không
    const isSeatSelected = (row, number) => {
        return selectedSeats.includes(`${row}${number}`);
    };

    // Danh sách hàng ghế chính theo thứ tự A, B, C, D, E, F, G, H, I
    const mainRowsOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    // Render các hàng ghế chính theo đúng thứ tự
    const renderMainRows = () => {
        const rows = [];
        
        mainRowsOrder.forEach(row => {
            let seatPattern;
            let rowType;
            
            // Xác định loại hàng và pattern ghế
            if (row === 'H' || row === 'I') {
                seatPattern = seatsData.seatNumbers.reducedPattern;
                rowType = 'reduced';
            } else if (['B', 'D', 'F'].includes(row)) {
                seatPattern = seatsData.seatNumbers.extendedPattern;
                rowType = 'extended';
            } else {
                seatPattern = seatsData.seatNumbers.defaultPattern;
                rowType = 'default';
            }

            // Hàng I chỉ có 13 ghế (từ 13 xuống 1 và từ 2 đến 12)
            if (row === 'I') {
                seatPattern = [13,11,9,7,5,3,1,2,4,6,8,10,12]; // 13 ghế
            }
            
            rows.push(
                <SeatRow
                    key={`main-${row}`}
                    row={row}
                    seats={seatPattern}
                    type="gray"
                    marginLeft={seatsData.getRowMargin(row, 'main')}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                    isSelected={isSeatSelected}
                    isOccupied={isSeatOccupied}
                />
            );
        });

        return rows;
    };

    // Render các hàng ghế phụ (màu xanh) theo thứ tự A, B, C, D, E
    const renderSecondaryRows = () => {
        const rows = [];
        const secondaryRowsOrder = ['A', 'B', 'C', 'D', 'E'];

        secondaryRowsOrder.forEach(row => {
            const seatPattern = row === 'E' 
                ? seatsData.seatNumbers.secondaryExtendedPattern 
                : seatsData.seatNumbers.secondaryDefaultPattern;
            
            rows.push(
                <SeatRow
                    key={`secondary-${row}`}
                    row={row}
                    seats={seatPattern}
                    type="blue"
                    marginLeft={seatsData.getRowMargin(row, 'secondary')}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                    isSelected={isSeatSelected}
                    isOccupied={isSeatOccupied}
                />
            );
        });

        return rows;
    };

    return (
        <div className="p-4 flex flex-col items-center min-h-screen bg-[#fdf5d3] font-['Times_New_Roman',_Times,_serif]">
            <header className="text-center mb-6">
                <h1 className="text-xl font-bold uppercase tracking-widest text-gray-800">
                    Sơ Đồ Rạp<br />Nhà Hát Kịch Việt Nam
                </h1>
            </header>

            <Stage stage={seatsData.stage} />

            {/* Main Seating - Hàng A đến I */}
            <section className="flex flex-col items-center mb-10 w-full overflow-x-auto">
                <div className="inline-block">
                    {renderMainRows()}
                </div>
            </section>

            {/* Secondary Seating - Hàng A đến E (màu xanh) */}
            <section className="flex flex-col items-center mb-12 w-full overflow-x-auto">
                <div className="inline-block">
                    {renderSecondaryRows()}
                </div>
            </section>

            <SeatLegend seatTypes={seatsData.seatTypes} />
            
            {/* Thông tin ghế đã chọn */}
            {selectedSeats.length > 0 && (
                <div className="mb-4 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
                    <h3 className="font-bold mb-2">Ghế đã chọn:</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {getSelectedSeatsInfo().map(seat => (
                            <span key={seat.id} className="px-2 py-1 bg-theater-red text-black rounded-md text-sm">
                                {seat.id} - {seat.type === 'vip' ? 'VIP' : 'Thường'} - {seat.price.toLocaleString()}đ
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">
                            Tổng: {calculateTotal().toLocaleString()}đ
                        </span>
                        <button
                            onClick={clearSelectedSeats}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </div>
            )}

            <SeatFooter 
                totalSeats={seatsData.summary.totalSeats}
                regularSeats={seatsData.summary.regularSeats}
                vipSeats={seatsData.summary.vipSeats}
                selectedSeats={selectedSeats.length}
                totalAmount={calculateTotal()}
            />
        </div>
    );
}