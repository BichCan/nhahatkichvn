// src/data/SeatsData.js

const seatsData = {
    // Cấu hình màu sắc và loại ghế
    seatTypes: {
        gray: {
            name: 'Ghế thường',
            color: '#b3b3b3',
            evenColor: '#7b7b7b',
            price: 350000
        },
        blue: {
            name: 'Ghế VIP',
            color: '#8b9dc3',
            evenColor: '#3b5998',
            price: 500000
        },
        selected: {
            color: '#10b981', // green-500
            textColor: 'white'
        }
    },

    // Sân khấu
    stage: {
        name: 'Khu Vực Sân Khấu',
        color: '#c94a4a',
        height: 'py-4',
        borderRadius: 'rounded-full'
    },

    // Cấu hình các hàng ghế chính (màu xám)
    mainRows: {
        // Hàng có 15 ghế: lẻ trái, chẵn phải (1-15)
        default: ['A', 'C', 'E', 'G'],
        // Hàng có 16 ghế: thêm ghế 16
        extended: ['B', 'D', 'F'],
        // Hàng có 14 ghế: bắt đầu từ 13
        reduced: ['H', 'I']
    },

    // Cấu hình các hàng ghế phụ (màu xanh)
    secondaryRows: {
        // Hàng có 9 ghế
        default: ['A', 'B', 'C', 'D'],
        // Hàng có 11 ghế (hàng cuối)
        extended: ['E']
    },

    // Dữ liệu số ghế cho từng loại
    seatNumbers: {
        // Mảng số ghế cho hàng default (15 ghế)
        defaultPattern: [15,13,11,9,7,5,3,1,2,4,6,8,10,12,14],
        
        // Mảng số ghế cho hàng extended (16 ghế)
        extendedPattern: [15,13,11,9,7,5,3,1,2,4,6,8,10,12,14,16],
        
        // Mảng số ghế cho hàng reduced (14 ghế)
        reducedPattern: [13,11,9,7,5,3,1,2,4,6,8,10,12,14],
        
        // Mảng số ghế cho hàng phụ default (9 ghế)
        secondaryDefaultPattern: [9,7,5,3,1,2,4,6,8],
        
        // Mảng số ghế cho hàng phụ extended (11 ghế)
        secondaryExtendedPattern: [11,9,7,5,3,1,2,4,6,8,10]
    },

    // Thông tin tổng quan
    summary: {
        totalSeats: 182,
        regularSeats: 0, // Sẽ tính sau
        vipSeats: 0      // Sẽ tính sau
    },

    // Hàm lấy số ghế theo loại hàng
    getSeatsForRow: (rowType, isExtended = false, isReduced = false) => {
        if (rowType === 'main') {
            if (isReduced) return seatsData.seatNumbers.reducedPattern;
            if (isExtended) return seatsData.seatNumbers.extendedPattern;
            return seatsData.seatNumbers.defaultPattern;
        } else {
            if (isExtended) return seatsData.seatNumbers.secondaryExtendedPattern;
            return seatsData.seatNumbers.secondaryDefaultPattern;
        }
    },

    // Hàm lấy margin left cho hàng
    getRowMargin: (row, type) => {
        if (type === 'main') {
            if (row === 'H') return 20;
            if (row === 'I') return 30;
            return 0;
        } else {
            if (row === 'E') return 20;
            return 40;
        }
    }
};

// Tính tổng số ghế thường và VIP
seatsData.summary.regularSeats = 
    seatsData.mainRows.default.length * seatsData.seatNumbers.defaultPattern.length +
    seatsData.mainRows.extended.length * seatsData.seatNumbers.extendedPattern.length +
    seatsData.mainRows.reduced.length * seatsData.seatNumbers.reducedPattern.length;

seatsData.summary.vipSeats = 
    seatsData.secondaryRows.default.length * seatsData.seatNumbers.secondaryDefaultPattern.length +
    seatsData.secondaryRows.extended.length * seatsData.seatNumbers.secondaryExtendedPattern.length;

export default seatsData;