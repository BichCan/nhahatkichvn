const playsdata = [
    // ============================================
    // VỞ ĐÃ DIỄN (Kết thúc trước 14/03/2026)
    // ============================================
    
    // Vở 7: Ngũ hổ tướng (p_id: 7) - Đã diễn: 15/01/2026 → 28/02/2026
    {
        id: 701,
        p_id: 7,
        date: "2026-01-15",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 702,
        p_id: 7,
        date: "2026-01-22",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 703,
        p_id: 7,
        date: "2026-02-05",
        time: "15:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 704,
        p_id: 7,
        date: "2026-02-18",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 705,
        p_id: 7,
        date: "2026-02-28",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },

    // Vở 11: Nghêu, Sò, Ốc, Hến (p_id: 11) - Đã diễn: 20/01/2026 → 05/03/2026
    {
        id: 1101,
        p_id: 11,
        date: "2026-01-20",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 1102,
        p_id: 11,
        date: "2026-01-28",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 1103,
        p_id: 11,
        date: "2026-02-10",
        time: "15:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 1104,
        p_id: 11,
        date: "2026-02-22",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 1105,
        p_id: 11,
        date: "2026-03-05",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },

    // ============================================
    // VỞ ĐANG DIỄN (Đang trong thời gian công chiếu)
    // ============================================
    // Hôm nay là 14/03/2026
    
    // Vở 3: Quan thanh tra (p_id: 3) - Đang diễn: 10/02/2026 → 25/03/2026
    {
        id: 301,
        p_id: 3,
        date: "2026-02-10",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 302,
        p_id: 3,
        date: "2026-02-18",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 303,
        p_id: 3,
        date: "2026-02-25",
        time: "15:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 304,
        p_id: 3,
        date: "2026-03-05",
        time: "20:00",
        available_seats: 12,
        status: "còn chỗ"
    },
    {
        id: 305,
        p_id: 3,
        date: "2026-03-14", // Hôm nay
        time: "20:00",
        available_seats: 5,
        status: "còn chỗ"
    },
    {
        id: 306,
        p_id: 3,
        date: "2026-03-20",
        time: "20:00",
        available_seats: 18,
        status: "còn chỗ"
    },
    {
        id: 307,
        p_id: 3,
        date: "2026-03-25",
        time: "15:00",
        available_seats: 25,
        status: "còn chỗ"
    },

    // Vở 5: Mặc cha sự đời (p_id: 5) - Đang diễn: 20/02/2026 → 05/04/2026
    {
        id: 501,
        p_id: 5,
        date: "2026-02-20",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 502,
        p_id: 5,
        date: "2026-02-27",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 503,
        p_id: 5,
        date: "2026-03-07",
        time: "15:00",
        available_seats: 8,
        status: "còn chỗ"
    },
    {
        id: 504,
        p_id: 5,
        date: "2026-03-14", // Hôm nay
        time: "20:00",
        available_seats: 15,
        status: "còn chỗ"
    },
    {
        id: 505,
        p_id: 5,
        date: "2026-03-21",
        time: "20:00",
        available_seats: 22,
        status: "còn chỗ"
    },
    {
        id: 506,
        p_id: 5,
        date: "2026-03-28",
        time: "15:00",
        available_seats: 30,
        status: "còn chỗ"
    },
    {
        id: 507,
        p_id: 5,
        date: "2026-04-05",
        time: "20:00",
        available_seats: 35,
        status: "còn chỗ"
    },

    // Vở 9: Thiên mệnh (p_id: 9) - Đang diễn: 05/02/2026 → 20/03/2026
    {
        id: 901,
        p_id: 9,
        date: "2026-02-05",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 902,
        p_id: 9,
        date: "2026-02-15",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 903,
        p_id: 9,
        date: "2026-02-22",
        time: "15:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 904,
        p_id: 9,
        date: "2026-03-02",
        time: "20:00",
        available_seats: 5,
        status: "còn chỗ"
    },
    {
        id: 905,
        p_id: 9,
        date: "2026-03-10",
        time: "20:00",
        available_seats: 12,
        status: "còn chỗ"
    },
    {
        id: 906,
        p_id: 9,
        date: "2026-03-18",
        time: "20:00",
        available_seats: 18,
        status: "còn chỗ"
    },
    {
        id: 907,
        p_id: 9,
        date: "2026-03-20",
        time: "15:00",
        available_seats: 22,
        status: "còn chỗ"
    },

    // ============================================
    // VỞ SẮP DIỄN (Bắt đầu sau 14/03/2026)
    // ============================================
    
    // Vở 1: Ngược chiều bình an (p_id: 1) - Sắp diễn: 15/03/2026 → 30/04/2026
    {
        id: 101,
        p_id: 1,
        date: "2026-03-15", // Ngày mai
        time: "20:00",
        available_seats: 45,
        status: "còn chỗ"
    },
    {
        id: 102,
        p_id: 1,
        date: "2026-03-22",
        time: "20:00",
        available_seats: 38,
        status: "còn chỗ"
    },
    {
        id: 103,
        p_id: 1,
        date: "2026-03-29",
        time: "15:00",
        available_seats: 52,
        status: "còn chỗ"
    },
    {
        id: 104,
        p_id: 1,
        date: "2026-04-05",
        time: "20:00",
        available_seats: 27,
        status: "còn chỗ"
    },
    {
        id: 105,
        p_id: 1,
        date: "2026-04-15",
        time: "20:00",
        available_seats: 32,
        status: "còn chỗ"
    },
    {
        id: 106,
        p_id: 1,
        date: "2026-04-25",
        time: "15:00",
        available_seats: 42,
        status: "còn chỗ"
    },
    {
        id: 107,
        p_id: 1,
        date: "2026-04-30",
        time: "20:00",
        available_seats: 50,
        status: "còn chỗ"
    },

    // Vở 2: Bóng tối (p_id: 2) - Sắp diễn: 01/03/2026 → 15/04/2026
    // (Đã bắt đầu nhưng còn suất)
    {
        id: 201,
        p_id: 2,
        date: "2026-03-01",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 202,
        p_id: 2,
        date: "2026-03-08",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 203,
        p_id: 2,
        date: "2026-03-15",
        time: "15:00",
        available_seats: 25,
        status: "còn chỗ"
    },
    {
        id: 204,
        p_id: 2,
        date: "2026-03-22",
        time: "20:00",
        available_seats: 18,
        status: "còn chỗ"
    },
    {
        id: 205,
        p_id: 2,
        date: "2026-03-29",
        time: "20:00",
        available_seats: 30,
        status: "còn chỗ"
    },
    {
        id: 206,
        p_id: 2,
        date: "2026-04-05",
        time: "15:00",
        available_seats: 35,
        status: "còn chỗ"
    },
    {
        id: 207,
        p_id: 2,
        date: "2026-04-12",
        time: "20:00",
        available_seats: 40,
        status: "còn chỗ"
    },
    {
        id: 208,
        p_id: 2,
        date: "2026-04-15",
        time: "20:00",
        available_seats: 45,
        status: "còn chỗ"
    },

    // Vở 4: Bộ quần áo mới của hoàng đế (p_id: 4) - Sắp diễn: 05/04/2026 → 20/05/2026
    {
        id: 401,
        p_id: 4,
        date: "2026-04-05",
        time: "15:00",
        available_seats: 60,
        status: "còn chỗ"
    },
    {
        id: 402,
        p_id: 4,
        date: "2026-04-12",
        time: "20:00",
        available_seats: 55,
        status: "còn chỗ"
    },
    {
        id: 403,
        p_id: 4,
        date: "2026-04-19",
        time: "15:00",
        available_seats: 50,
        status: "còn chỗ"
    },
    {
        id: 404,
        p_id: 4,
        date: "2026-04-26",
        time: "20:00",
        available_seats: 45,
        status: "còn chỗ"
    },
    {
        id: 405,
        p_id: 4,
        date: "2026-05-03",
        time: "15:00",
        available_seats: 40,
        status: "còn chỗ"
    },
    {
        id: 406,
        p_id: 4,
        date: "2026-05-10",
        time: "20:00",
        available_seats: 35,
        status: "còn chỗ"
    },
    {
        id: 407,
        p_id: 4,
        date: "2026-05-17",
        time: "15:00",
        available_seats: 42,
        status: "còn chỗ"
    },
    {
        id: 408,
        p_id: 4,
        date: "2026-05-20",
        time: "20:00",
        available_seats: 48,
        status: "còn chỗ"
    },

    // Vở 6: Rồng thần trở lại (p_id: 6) - Sắp diễn: 01/05/2026 → 15/06/2026
    {
        id: 601,
        p_id: 6,
        date: "2026-05-01",
        time: "10:00",
        available_seats: 55,
        status: "còn chỗ"
    },
    {
        id: 602,
        p_id: 6,
        date: "2026-05-08",
        time: "15:00",
        available_seats: 48,
        status: "còn chỗ"
    },
    {
        id: 603,
        p_id: 6,
        date: "2026-05-15",
        time: "10:00",
        available_seats: 42,
        status: "còn chỗ"
    },
    {
        id: 604,
        p_id: 6,
        date: "2026-05-22",
        time: "15:00",
        available_seats: 38,
        status: "còn chỗ"
    },
    {
        id: 605,
        p_id: 6,
        date: "2026-05-29",
        time: "10:00",
        available_seats: 45,
        status: "còn chỗ"
    },
    {
        id: 606,
        p_id: 6,
        date: "2026-06-05",
        time: "15:00",
        available_seats: 52,
        status: "còn chỗ"
    },
    {
        id: 607,
        p_id: 6,
        date: "2026-06-12",
        time: "10:00",
        available_seats: 58,
        status: "còn chỗ"
    },
    {
        id: 608,
        p_id: 6,
        date: "2026-06-15",
        time: "15:00",
        available_seats: 62,
        status: "còn chỗ"
    },

    // Vở 8: Đêm trắng (p_id: 8) - Sắp diễn: 10/03/2026 → 25/04/2026
    // (Đã bắt đầu nhưng còn suất)
    {
        id: 801,
        p_id: 8,
        date: "2026-03-10",
        time: "20:00",
        available_seats: 0,
        status: "đã đóng"
    },
    {
        id: 802,
        p_id: 8,
        date: "2026-03-17",
        time: "20:00",
        available_seats: 12,
        status: "còn chỗ"
    },
    {
        id: 803,
        p_id: 8,
        date: "2026-03-24",
        time: "15:00",
        available_seats: 18,
        status: "còn chỗ"
    },
    {
        id: 804,
        p_id: 8,
        date: "2026-03-31",
        time: "20:00",
        available_seats: 22,
        status: "còn chỗ"
    },
    {
        id: 805,
        p_id: 8,
        date: "2026-04-07",
        time: "20:00",
        available_seats: 25,
        status: "còn chỗ"
    },
    {
        id: 806,
        p_id: 8,
        date: "2026-04-14",
        time: "15:00",
        available_seats: 30,
        status: "còn chỗ"
    },
    {
        id: 807,
        p_id: 8,
        date: "2026-04-21",
        time: "20:00",
        available_seats: 35,
        status: "còn chỗ"
    },
    {
        id: 808,
        p_id: 8,
        date: "2026-04-25",
        time: "20:00",
        available_seats: 40,
        status: "còn chỗ"
    },

    // Vở 10: Điều còn lại (p_id: 10) - Sắp diễn: 01/06/2026 → 15/07/2026
    {
        id: 1001,
        p_id: 10,
        date: "2026-06-01",
        time: "20:00",
        available_seats: 65,
        status: "còn chỗ"
    },
    {
        id: 1002,
        p_id: 10,
        date: "2026-06-08",
        time: "20:00",
        available_seats: 60,
        status: "còn chỗ"
    },
    {
        id: 1003,
        p_id: 10,
        date: "2026-06-15",
        time: "15:00",
        available_seats: 55,
        status: "còn chỗ"
    },
    {
        id: 1004,
        p_id: 10,
        date: "2026-06-22",
        time: "20:00",
        available_seats: 50,
        status: "còn chỗ"
    },
    {
        id: 1005,
        p_id: 10,
        date: "2026-06-29",
        time: "20:00",
        available_seats: 45,
        status: "còn chỗ"
    },
    {
        id: 1006,
        p_id: 10,
        date: "2026-07-06",
        time: "15:00",
        available_seats: 40,
        status: "còn chỗ"
    },
    {
        id: 1007,
        p_id: 10,
        date: "2026-07-13",
        time: "20:00",
        available_seats: 48,
        status: "còn chỗ"
    },
    {
        id: 1008,
        p_id: 10,
        date: "2026-07-15",
        time: "20:00",
        available_seats: 52,
        status: "còn chỗ"
    },

    // Vở 12: Người tốt nhà số 5 (p_id: 12) - Sắp diễn: 15/04/2026 → 30/05/2026
    {
        id: 1201,
        p_id: 12,
        date: "2026-04-15",
        time: "20:00",
        available_seats: 58,
        status: "còn chỗ"
    },
    {
        id: 1202,
        p_id: 12,
        date: "2026-04-22",
        time: "20:00",
        available_seats: 52,
        status: "còn chỗ"
    },
    {
        id: 1203,
        p_id: 12,
        date: "2026-04-29",
        time: "15:00",
        available_seats: 48,
        status: "còn chỗ"
    },
    {
        id: 1204,
        p_id: 12,
        date: "2026-05-06",
        time: "20:00",
        available_seats: 45,
        status: "còn chỗ"
    },
    {
        id: 1205,
        p_id: 12,
        date: "2026-05-13",
        time: "20:00",
        available_seats: 50,
        status: "còn chỗ"
    },
    {
        id: 1206,
        p_id: 12,
        date: "2026-05-20",
        time: "15:00",
        available_seats: 55,
        status: "còn chỗ"
    },
    {
        id: 1207,
        p_id: 12,
        date: "2026-05-27",
        time: "20:00",
        available_seats: 60,
        status: "còn chỗ"
    },
    {
        id: 1208,
        p_id: 12,
        date: "2026-05-30",
        time: "20:00",
        available_seats: 62,
        status: "còn chỗ"
    }
];

export default playsdata;