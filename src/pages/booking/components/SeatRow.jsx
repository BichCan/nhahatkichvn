import React from 'react';
import Seat from './Seat';

export default function SeatRow({ 
    row, 
    seats, 
    type, 
    marginLeft = 0, 
    selectedSeats, 
    onSeatSelect,
    isSelected,
    isOccupied
}) {
    return (
        <div className="flex items-center mb-1">
            <span className="row-label w-[20px] font-bold text-left">{row}</span>
            <div 
                className="flex" 
                style={{ marginLeft: marginLeft > 0 ? `${marginLeft}px` : 0 }}
            >
                {seats.map((number, index) => {
                    const seatId = `${row}${number}`;
                    const occupied = isOccupied(row, number);
                    
                    return (
                        <Seat
                            key={seatId}
                            row={row}
                            number={number}
                            type={type}
                            isSelected={isSelected(row, number)}
                            isOccupied={occupied}
                            onClick={() => !occupied && onSeatSelect(row, number)}
                        />
                    );
                })}
            </div>
        </div>
    );
}