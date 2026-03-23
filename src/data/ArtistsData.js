const artistsData = [
    {
        id: 1,
        name: "NSƯT Kiều Minh Hiếu",
        slug: "nsut-kieu-minh-hieu",
        
        // Thông tin cơ bản
        birthYear: 1975,
        location: "Hà Nội",
        yearsActive: 25,
        
        // Chức vụ
        positions: [
            { title: "Phó Giám đốc", period: "2020 - nay", organization: "Nhà hát Kịch Việt Nam" },
            { title: "Trưởng đoàn Kịch Cổ điển", period: "Trước 2020", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Danh hiệu
        titles: [
            { name: "Nghệ sĩ Ưu tú", year: 2019 }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/kieuminhhieu.jpg",
        images: [
            { src: "/images/artists/kieu-minh-hieu-1.jpg", caption: "NSƯT Kiều Minh Hiếu tại lễ bổ nhiệm Phó Giám đốc" },
            { src: "/images/artists/kieu-minh-hieu-2.jpg", caption: "NSƯT Kiều Minh Hiếu tại lễ trao tặng danh hiệu NSƯT Lần thứ IX - 2019" },
            { src: "/images/artists/kieu-minh-hieu-3.jpg", caption: "Đạo diễn - NSƯT Kiều Minh Hiếu nhận Huy chương vàng vở kịch 'Điều còn lại'" },
            { src: "/images/artists/kieu-minh-hieu-4.jpg", caption: "Hình ảnh trẻ trung, hiền lành trong tạo hình nhân vật trên phim truyền hình" }
        ],
        
        // Giới thiệu
        bio: "NSƯT Kiều Minh Hiếu sinh năm 1975, hiện đang sinh sống và làm việc tại Hà Nội. Ông đã có khoảng 25 năm gắn bó với mái nhà chung mang tên Nhà hát Kịch Việt Nam.",
        
        // Quote
        quote: "Nhận nhiệm vụ mới cũng là thách thức mới với tôi. Tuy nhiên, như kim chỉ nam ban đầu khi bước chân vào Nhà hát Kịch Việt Nam, tôi luôn mong muốn làm được điều tốt nhất cho Nhà hát chứ không phải tốt nhất cho riêng mình. Tôi sẽ cố gắng cùng Ban giám đốc nhà hát chèo lái con thuyền Kịch Việt Nam đi đúng hướng.",
        philosophy: "Tôi luôn tận tâm hết sức để làm được những điều tốt nhất cho Nhà hát, chứ không phải làm để được lợi cho bản thân.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Kiều",
            "Lâu đài cát",
            "Người thi hành án tử",
            "Chuyện chàng dũng sĩ",
            "Hamlet",
            "Trong mưa dông thấy nắng",
            "Thế sự",
            "Điều còn lại (vai trò đạo diễn)"
        ],
        
        // Phim đã tham gia
        films: [
            "Khi đàn chim trở về (phần 1 và 2)",
            "Nếp nhà",
            "Định mệnh",
            "Vòng nguyệt quế",
            "Chàng trai đa cảm"
        ],
        
        // Lồng tiếng
        voiceWork: [
            "Nhiều vở kịch",
            "Phim bộ"
        ],
        
        // Thành tích
        achievements: [
            { year: 2015, achievement: "Huy chương Vàng tại Liên hoan Nghệ thuật sân khấu Hình tượng người chiến sĩ Công an nhân dân lần thứ 3 với vở 'Trong mưa dông thấy nắng'" },
            { year: 2021, achievement: "Huy chương Vàng tại Liên hoan Sân khấu Kịch nói toàn quốc ở Hải Phòng với vở kịch 'Điều còn lại' (vai trò đạo diễn)" }
        ],
        
        // Sự kiện quan trọng
        milestones: [
            { date: "29/06/2020", event: "Được bổ nhiệm chức vụ Phó Giám đốc Nhà hát Kịch Việt Nam (nhiệm kỳ 5 năm)" },
            { date: "2019", event: "Được phong tặng danh hiệu Nghệ sĩ Ưu tú" }
        ],
        
        // Thông tin bổ sung
        otherActivities: [
            "Lồng tiếng cho nhiều vở kịch và phim bộ"
        ]
    },
    {
        id: 2,
        name: "NSƯT Trịnh Mai Nguyên",
        slug: "nsut-trinh-mai-nguyen",
        fullName: "Trịnh Mai Nguyên",
        
        // Thông tin cơ bản
        birthYear: 1975,
        birthPlace: "Thanh Hóa",
        location: "Hà Nội",
        yearsActive: 20,
        
        // Chức vụ
        positions: [
            { title: "Trưởng đoàn Kịch Đương Đại", period: "2019 - nay", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Danh hiệu
        titles: [
            { name: "Nghệ sĩ Ưu tú", year: 2019 }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/trinhmainguyen.jpg",
        images: [
            { src: "/public/Artists/trinh-mai-nguyen-1.jpg", caption: "NSƯT Trịnh Mai Nguyên trong vai Đại tướng Võ Nguyên Giáp" }
        ],
        
        // Giới thiệu
        bio: "NSƯT Mai Nguyên tên đầy đủ là Trịnh Mai Nguyên, sinh năm 1975. Nam nghệ sĩ là người gốc Thanh Hoá, lớn lên và sinh sống tại Hà Nội. Tính đến thời điểm hiện tại, anh đã có khoảng 20 năm theo đuổi sự nghiệp diễn xuất.",
        
        // Vai diễn đặc biệt
        notableRoles: [
            { role: "Đại tướng Võ Nguyên Giáp", count: 3, description: "3 lần được vào vai Đại tướng Võ Nguyên Giáp, là vai diễn giúp khán giả sân khấu nhớ mặt Trịnh Mai Nguyên" }
        ],
        
        // Quote
        quote: "Sau khi nhận vai, tôi đã dành một tháng để nghiền ngẫm tư liệu và hình ảnh về Tướng Giáp mà phía Pháp đã chuẩn bị. Tôi rất hạnh phúc vì được đóng vai người con kiệt xuất của dân tộc nhưng cũng không khỏi lo lắng vì nhân vật ấy được hàng triệu người yêu mến. Vì vậy, tôi dành nhiều thời gian nghiên cứu thần thái, tiểu sử, nội tâm của danh tướng rất kỹ để nhập vai tốt nhất.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Nghêu Sò Ốc Hến",
            "Kiều",
            "Lâu đài cát",
            "Lão hà tiện",
            "Chuyện chàng dũng sĩ",
            "Hamlet",
            "Thế sự",
            "Đám cưới con gái chuột",
            "Hồn Trương Ba da hàng thịt",
            "Chia tay hoàng hôn"
        ],
        
        // Phim đã tham gia
        films: [
            { year: 2002, title: "Leclerc (Tuyết Đông Dương)", director: "Marco Pico", role: "Đại tướng Võ Nguyên Giáp thời trẻ" }
        ],
        
        // Thành tích
        achievements: [
            { year: 2012, achievement: "Huy chương Bạc tại Liên hoan Sân khấu kịch nói chuyên nghiệp toàn quốc với 'Chia tay hoàng hôn'" },
            { year: 2013, achievement: "Huy chương Bạc tại Liên hoan Sân khấu kịch Lưu Quang Vũ với 'Hồn Trương Ba da hàng thịt'" },
            { year: 2015, achievement: "Huy chương Vàng tại Cuộc thi Nghệ thuật Sân khấu kịch nói chuyên nghiệp toàn quốc với 'Lâu đài cát'" }
        ],
        
        // Sự kiện quan trọng
        milestones: [
            { date: "2019", event: "Được phong tặng danh hiệu Nghệ sĩ Ưu tú" },
            { date: "2019", event: "Được bổ nhiệm làm Trưởng đoàn Kịch Đương Đại" }
        ]
    },
    {
        id: 3,
        name: "NSƯT Nông Dũng Nam",
        slug: "nsut-nong-dung-nam",
        fullName: "Nông Dũng Nam",
        
        // Thông tin cơ bản
        birthYear: 1979,
        location: "Hà Nội",
        education: "Đại học Sân khấu Điện ảnh",
        
        // Chức vụ
        positions: [
            { title: "Phó Trưởng đoàn Đoàn kịch Đương đại", period: "2021 - nay", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Danh hiệu
        titles: [
            { name: "Nghệ sĩ Ưu tú", year: 2019 }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/nongdungnam.jpg",
        images: [],
        
        // Giới thiệu
        bio: "NSƯT Nông Dũng Nam sinh năm 1979, từng là sinh viên của đại học Sân khấu Điện ảnh.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Kiều",
            "Tai biến",
            "Bệnh sĩ",
            "Biệt đội báo đen",
            "Bão tố Trường Sơn",
            "Nghêu Sò Ốc Hến",
            "Thế sự",
            "Dư chấn",
            "Kiều Loan"
        ],
        
        // Thành tích
        achievements: [
            { year: 2009, achievement: "Huy chương Bạc tại HDSK Kịch nói chuyên nghiệp toàn quốc (Kiều Loan)" },
            { year: 2010, achievement: "Huy chương Bạc tại LH Nghệ thuật sân khấu về Hình tượng người chiến sĩ Công an nhân dân lần thứ 2 (Tiếng chuông)" },
            { year: 2015, achievement: "Huy chương Bạc với vở 'Bệnh sĩ' trong Cuộc thi Nghệ thuật sân khấu kịch nói chuyên nghiệp toàn quốc" },
            { year: 2015, achievement: "Huy chương Bạc với vở 'Dư chấn' tại LH Nghệ thuật sân khấu về Hình tượng người chiến sĩ Công an nhân dân lần thứ 3" },
            { year: 2018, achievement: "Huy chương Bạc (vở 'Bão tố Trường Sơn') tại Liên hoan Kịch nói toàn quốc 2018" }
        ],
        
        // Sự kiện quan trọng
        milestones: [
            { date: "2019", event: "Được phong tặng danh hiệu Nghệ sĩ Ưu tú" },
            { date: "2021", event: "Được bổ nhiệm chức vụ Phó Trưởng đoàn Đoàn kịch Đương đại" }
        ]
    },
    {
        id: 4,
        name: "Quang Đạo",
        slug: "quang-dao",
        fullName: "Quang Đạo",
        
        // Thông tin cơ bản
        birthYear: 1993,
        birthPlace: "Việt Trì",
        education: "Đại học Sư phạm Nghệ Thuật Trung Ương (Diễn Viên Kịch - ĐA K1)",
        
        // Quá trình công tác
        workHistory: [
            { period: "2014 - nay", position: "Diễn viên", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/quangdao.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Quang Đạo sinh năm 1993, chàng trai trẻ quen mặt của sân khấu kịch là người con của vùng đất Việt Trì. Anh theo học Diễn Viên Kịch - ĐA K1 tại Đại học Sư phạm Nghệ Thuật Trung Ương. Sau khi tốt nghiệp, anh về đầu quân cho Nhà hát Kịch Việt Nam vào năm 2014 và dần tìm được chỗ đứng trong dàn diễn trẻ của nhà hát.",
        
        // Phong cách
        style: "Anh tích cực tham gia nhiều tác phẩm của nhà hát dù vai lớn hay nhỏ, và luôn thiện chí chăm chỉ cầu tiến tập luyện học hỏi để hoàn thành tốt những vai diễn được giao.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Điều còn lại (vai Bường)"
        ],
        
        // Thành tích
        achievements: [
            { year: 2021, achievement: "Huy chương Đồng với vai Bường trong vở kịch 'Điều còn lại' tại Liên hoan Sân Khấu Kịch Nói toàn quốc tại Hải Phòng" }
        ]
    },
    {
        id: 5,
        name: "NSƯT Xuân Bắc",
        slug: "nsut-xuan-bac",
        fullName: "Nguyễn Xuân Bắc",
        
        // Thông tin cơ bản
        birthDate: "21/08/1976",
        birthYear: 1976,
        birthPlace: "Việt Trì, Phú Thọ",
        location: "Hà Nội",
        
        // Học vấn
        education: [
            { period: "1982-1987", school: "Trường Tiểu học Hòa Bình, phường Thanh Miếu, TP. Việt Trì" },
            { period: "1987-1991", school: "THCS Lý Tự Trọng, phường Thanh Miếu, TP. Việt Trì" },
            { period: "1991-1994", school: "Trường Trung học phổ thông Công nghiệp Việt Trì, TP. Việt Trì" }
        ],
        
        // Chức vụ
        positions: [
            { title: "Giám đốc", period: "Hiện nay", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Danh hiệu
        titles: [
            { name: "Nghệ sĩ Ưu tú", year: "" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/xuanbac.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Nghệ sĩ Xuân Bắc tên thật là Nguyễn Xuân Bắc (sinh ngày 21 tháng 8 năm 1976) là một Nghệ sĩ Ưu tú, diễn viên, người dẫn chương trình, nghệ sĩ hài người Việt Nam. Hiện anh đang là giám đốc nhà hát kịch Việt Nam. Xuân Bắc sinh tại phố Thanh Hà, phường Thanh Miếu, thành phố Việt Trì, tỉnh Phú Thọ.",
        
        // Quote
        quote: "Nếu một nghệ sĩ nào đó hoạt động để nhằm đạt được danh hiệu nào đó thì e rằng chữ nghệ sĩ trong họ không ổn lắm. Vì bản chất của nghệ thuật là sự sáng tạo không ngừng và sáng tạo đến từ cảm xúc. Nếu cảm xúc có trong sự tính toán thì không ổn. Nếu được ghi nhận, vinh danh là tốt, nhưng làm không phải để được vinh danh, mà làm để có những tác phẩm tốt.",
        
        // Vai diễn nổi bật
        notableRoles: [
            { role: "Núi", production: "Sóng ở đáy sông" },
            { role: "Nam Tào", production: "Gặp nhau cuối năm" },
            { role: "MC Trần Xoáy", production: "Hỏi xoáy đáp xoay" }
        ],
        
        // Chương trình truyền hình
        tvShows: [
            { role: "Diễn viên hài", show: "Gặp nhau cuối tuần" },
            { role: "Diễn viên", show: "Gặp nhau cuối năm (vai Nam Tào)" },
            { role: "MC Trần Xoáy", show: "Hỏi xoáy đáp xoay (Thư giãn cuối tuần)" },
            { role: "MC", show: "Hỏi Xiên Đáp Xẹo" },
            { role: "Dẫn dắt", show: "Đuổi hình bắt chữ" },
            { role: "Bình luận", show: "Hành trình kết nối những trái tim" },
            { role: "Dẫn chương trình", show: "Vũ điệu tuổi xanh" },
            { role: "Giám khảo/MC", show: "Đồ Rê Mí" },
            { role: "Dẫn dắt", show: "Ơn giời cậu đây rồi!" },
            { role: "Tham gia", show: "Bố ơi! Mình đi đâu thế? (mùa 2, cùng con trai Bi)" },
            { role: "Dẫn dắt", show: "Ban nhạc Việt" },
            { role: "Dẫn dắt", show: "Chân ái (cùng Cát Tường)" },
            { role: "Giám khảo", show: "SV 2016, 2020" },
            { role: "Khách mời", show: "Hoán đổi" },
            { role: "Người chơi", show: "Ai là triệu phú" },
            { role: "Khách mời bình luận", show: "World Cup 2014, Euro 2012, Euro 2020" },
            { role: "Khách mời", show: "Cà phê sáng" },
            { role: "Giám khảo", show: "Gương mặt thân quen Nhí (mùa 4)" },
            { role: "Người dẫn chương trình", show: "Vua tiếng Việt" },
            { role: "Giám khảo", show: "Siêu thử thách" }
        ],
        
        // Phim đã tham gia
        films: [
            { year: 1995, title: "12A và 4H" },
            { year: 1997, title: "Ngã ba Đồng Lộc" },
            { year: 1998, title: "Chuyện nhà Mộc" },
            { year: 1998, title: "Kẻ cắp bất đắc dĩ" },
            { year: 1998, title: "Đảo xa" },
            { year: 1999, title: "Nhịp tim lầm lạc" },
            { year: 1999, title: "Thăng bằng" },
            { year: 1999, title: "Đồng quê xào xạc" },
            { year: 2000, title: "Ông bầu ca nhạc" },
            { year: 2000, title: "Sóng ở đáy sông" },
            { year: 2000, title: "Nơi tình yêu bắt đầu" },
            { year: 2001, title: "Chuyến tắc-xi cuối cùng" },
            { year: 2001, title: "Chuyện ở công ty Thu Vào" },
            { year: 2001, title: "Nối lại một chân dung" },
            { year: 2002, title: "Miếu làng" },
            { year: 2002, title: "Công dân vàng" },
            { year: 2002, title: "Chuyện ngày xưa" },
            { year: 2004, title: "Râu quặp" },
            { year: 2005, title: "Niệm khúc cuối" },
            { year: 2007, title: "Con đường sáng" },
            { year: 2010, title: "Cả ngố" },
            { year: 2012, title: "Hai phía chân trời" },
            { year: 2013, title: "Không hề biết giận" },
            { year: 2015, title: "Quan trường trường quan" }
        ]
    },
    {
        id: 6,
        name: "Thân Thanh Giang",
        slug: "than-thanh-giang",
        fullName: "Thân Thị Thanh Giang",
        
        // Thông tin cơ bản
        birthDate: "12/07/1982",
        birthYear: 1982,
        location: "Hà Nội",
        
        // Nơi công tác
        organization: "Đoàn Kịch Cổ Điển Nhà Hát Kịch Việt Nam",
        position: "Diễn viên biểu diễn kịch nói",
        workPeriod: "2016 - nay",
        
        // Quá trình công tác
        workHistory: [
            { period: "2016 - nay", position: "Diễn Viên Biểu Diễn Kịch Nói", department: "Đoàn Kịch Cổ Điển" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/thanthanhgiang.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Nghệ sĩ Thân Thanh Giang sinh ngày 12 tháng 7 năm 1982. Chị công tác tại Đoàn Kịch Cổ Điển Nhà Hát Kịch Việt Nam từ năm 2016 đến nay với vai trò diễn viên biểu diễn kịch nói.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Tội Lỗi",
            "Cuội Buôn Quan",
            "Đêm Của Bóng Tối",
            "Mỹ Nhân Và Anh Hùng",
            "Trong Mưa Dông Thấy Nắng",
            "Bà Tỷ Phú Về Thăm Quê",
            "Hămlet",
            "Thầy và Trò",
            "Bão Tố Trường Sơn",
            "Đêm Trắng"
        ],
        
        // Phim đã tham gia
        films: [
            { year: 2000, title: "Đất và Người", director: "Nguyễn Hữu Phần", role: "Đào" },
            { year: 2000, title: "Người Đi Tìm Giấc Mơ", role: "Thảo" },
            { year: 2000, title: "Những Con Đường" },
            { year: 2000, title: "Cảnh sát hình sự" },
            { year: 2001, title: "Trò Đùa Số Phận" },
            { year: 2001, title: "Nơi Tình Yêu Bắt đầu", director: "Nguyễn Hồng Sơn", role: "Giang" },
            { year: 2002, title: "Cỏ Lông Chông" },
            { year: 2003, title: "Hương Đất" },
            { year: 2004, title: "Không Gian Đa Chiều", director: "Bùi Huy Thuần", role: "Thìn" },
            { year: 2005, title: "Khát Vọng Công Lý", director: "Nguyễn Anh Tuấn", role: "Luật Sư Thuỷ" },
            { year: 2006, title: "Những Người Độc Thân Vui vẻ" },
            { year: 2007, title: "Người Mang Nợ", director: "Nguyễn Việt Sơn" },
            { year: 2009, title: "13 Nữ Tù", director: "Lưu Trọng Ninh" },
            { year: 2012, title: "Hoa Cỏ May phần 3", director: "Lưu Trọng Ninh", role: "Ngậm" },
            { year: 2014, title: "Nỗi Đau Dấu Kín", director: "Trần Vịnh", role: "Hương" }
        ],
        
        // Thành tích
        achievements: [
            { achievement: "Huy Chương Bạc vai diễn Thảo Ngọc - vở diễn Bão Tối Trường Sơn - Cố Đạo diễn NSND Anh Tú" }
        ],
        
        // Sự kiện quan trọng
        milestones: [
            { date: "2016", event: "Bắt đầu công tác tại Đoàn Kịch Cổ Điển Nhà Hát Kịch Việt Nam" }
        ]
    },
    {
        id: 7,
        name: "Hồng Phúc",
        slug: "hong-phuc",
        fullName: "Nguyễn Hồng Phúc",
        
        // Thông tin cơ bản
        birthDate: "13/09/1995",
        birthYear: 1995,
        birthPlace: "Yên Bái",
        location: "Hà Nội",
        education: "Cao đẳng Nghệ thuật Hà Nội (Cử nhân diễn viên Kịch - Điện ảnh)",
        
        // Quá trình công tác
        workHistory: [
            { period: "Hiện nay", position: "Diễn viên", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/hongphuc.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Hồng Phúc tên thật là Nguyễn Hồng Phúc, sinh ngày 13/9/1995. Anh là cử nhân diễn viên Kịch - Điện ảnh tại trường Cao đẳng Nghệ thuật Hà Nội, sau đó công tác tại Nhà hát Kịch Việt Nam cho đến nay. Nghệ sĩ Hồng Phúc là một diễn viên trẻ đầy tài năng của Nhà hát Kịch Việt Nam.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Bão Tố Trường Sơn",
            "Kiều",
            "Nghêu, sò, ốc, hến",
            "Cô gái và chiếc xe máy",
            "Sự sống",
            "Người tốt nhà số 5",
            "Đêm Trắng",
            "Thiên Mệnh",
            "Ôn Đình chém Tá (vai Khương Linh Tá)"
        ],
        
        // Thành tích
        achievements: [
            { year: 2017, achievement: "Tài năng trẻ triển vọng Liên hoan tài năng trẻ sân khấu kịch nói Toàn quốc với vở 'Ôn Đình chém Tá' vai Khương Linh Tá" },
            { year: 2020, achievement: "Huy chương Bạc Liên hoan sân khấu Thủ Đô vai Khôi 'lốp' - vở 'Người tốt nhà số 5'" },
            { year: 2021, achievement: "Huy chương Đồng Liên hoan sân khấu kịch nói toàn quốc vai Vua Trần Thái Tông trong vở 'Thiên Mệnh'" }
        ]
    },
    {
        id: 8,
        name: "Tô Tuấn Dũng",
        slug: "to-tuan-dung",
        fullName: "Tô Tuấn Dũng",
        
        // Thông tin cơ bản
        birthDate: "05/09/1991",
        birthYear: 1991,
        education: "Đại học Sân khấu và Điện ảnh Hà Nội (2012)",
        
        // Nơi công tác
        organization: "Đoàn kịch Cổ điển - Nhà hát Kịch Việt Nam",
        
        // Quá trình công tác
        workHistory: [
            { period: "2012 - nay", position: "Diễn viên", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/todung.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Họ và tên: Tô Tuấn Dũng, sinh ngày 05/09/1991. Năm 2012 tốt nghiệp lớp diễn viên trường Đại học Sân khấu và Điện ảnh Hà Nội về công tác tại Nhà hát Kịch Việt Nam. Từ đó đến nay đã tham gia và hoàn thành rất nhiều vai diễn trong các vở kịch của Nhà hát.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Trong mưa giông thấy nắng",
            "Đám cưới chuột",
            "Hamlet",
            "Biệt đội báo đen",
            "Chia tay hoàng hôn",
            "Bão tố trường sơn",
            "Kiều",
            "Lão hà tiện",
            "Hồng lâu mộng",
            "Nguồn sáng trong đời",
            "Điều còn lại",
            "Nhân thế"
        ],
        
        // Phim đã tham gia
        films: [
            { year: 2011, title: "Mùi cỏ cháy (phim điện ảnh)", achievement: "Bông sen vàng, Cánh Diều Vàng" },
            { year: 2012, title: "Mùi cỏ cháy (phim điện ảnh)" },
            { year: 2014, title: "Bão qua làng (phim TH)" },
            { year: 2015, title: "Ma Rừng (phim điện ảnh)" },
            { year: 2015, title: "Màu của tình yêu (phim TH)" },
            { year: 2016, title: "Hợp đồng hôn nhân (phim TH)" },
            { year: 2019, title: "Lửa Ấm (phim TH)" },
            { year: 2020, title: "Mùa xuân ở lại (phim TH)" },
            { year: 2021, title: "Hương vị tình thân (phim TH)" },
            { year: 2022, title: "Lối về miền hoa (phim TH)" }
        ],
        
        // Thành tích
        achievements: [
            { year: 2011, achievement: "Giải Bông sen vàng cùng phim điện ảnh Mùi Cỏ Cháy" },
            { year: 2012, achievement: "Giải Cánh Diều Vàng cùng phim điện ảnh Mùi Cỏ Cháy" },
            { year: 2017, achievement: "Giải diễn viên kịch nói xuất sắc" },
            { year: 2019, achievement: "Giải bạc Liên hoan hình tượng người chiến sĩ CAND" },
            { year: 2020, achievement: "Giải bạc liên hoan Tài Năng Trẻ Sân Khấu" },
            { year: 2021, achievement: "Giải vàng liên hoan Kịch nói toàn quốc" }
        ]
    },
    {
        id: 9,
        name: "Việt Hoa",
        slug: "viet-hoa",
        fullName: "Vũ Việt Hoa",
        
        // Thông tin cơ bản
        birthYear: 1996,
        birthPlace: "Yên Bái",
        location: "Hà Nội",
        education: "Đại học Sân khấu Điện ảnh Hà Nội",
        
        // Nơi công tác
        organization: "Nhà hát Kịch Việt Nam",
        
        // Ảnh đại diện
        avatar: "/Artists/viethoa.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Việt Hoa tên đầy đủ là Vũ Việt Hoa, là một nữ diễn viên trẻ của Nhà hát Kịch Việt Nam. Cô đã tốt nghiệp lớp Diễn viên kịch, điện ảnh tại trường Đại học Sân khấu Điện ảnh Hà Nội. Mới đây, Việt Hoa bất ngờ được khán giả truyền hình chú ý khi vào vai Đào trong phim 'Cô gái nhà người ta', vai Thiên Nga trong phim 'Hương vị tình thân',... Tài năng trẻ này sinh năm 1996, được sinh ra và lớn lên tại thành phố Yên Bái. Hiện tại, cô đang sinh sống và làm việc tại Hà Nội.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Lôi Vũ (vai Phồn Y)"
        ],
        
        // Phim đã tham gia
        films: [
            { title: "Những thiên thần nhà S6", role: "giúp việc" },
            { title: "Những ngày không quên", role: "Đào" },
            { title: "Trở về giữa yêu thương", role: "Yến" },
            { title: "Cô gái nhà người ta", role: "Đào" },
            { title: "Hương vị tình thân", role: "Thiên Nga" },
            { title: "Anh có phải đàn ông không", role: "Lệ" }
        ],
        
        // Thành tích
        achievements: [
            { year: 2020, achievement: "Huy chương Vàng cuộc thi 'Tài năng trẻ diễn viên kịch nói toàn quốc' với vai Phồn Y trong vở kịch Lôi Vũ" },
            { year: 2021, achievement: "Danh hiệu Gương mặt nghệ sĩ tiêu biểu ngành nghệ thuật biểu diễn năm 2021" },
            { year: 2021, achievement: "Huy chương Vàng của Liên Hoan Kịch Nói Chuyên Nghiệp toàn quốc với vai diễn trong vở 'Điều còn lại'" }
        ]
    },
    {
        id: 10,
        name: "Nguyễn Minh Hải",
        slug: "nguyen-minh-hai",
        fullName: "Nguyễn Minh Hải",
        
        // Thông tin cơ bản
        birthDate: "03/03/1979",
        birthYear: 1979,
        
        // Nơi công tác
        organization: "Đoàn kịch Cổ điển - Nhà hát Kịch Việt Nam",
        
        // Học vấn
        education: [
            { period: "1997-2000", school: "Trường ĐH Sân khấu Điện ảnh Hà Nội", major: "Diễn viên Sân khấu và Điện ảnh (Hệ Cao đẳng)" }
        ],
        
        // Quá trình công tác
        workHistory: [
            { period: "2000 - nay", position: "Diễn viên kịch nói", organization: "Đoàn Kịch Cổ điển - Nhà hát Kịch Việt Nam" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/minhhai.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Họ và tên: Nguyễn Minh Hải, sinh ngày 03/3/1979. Từ 1997 – 2000 là sinh viên Khoa Diễn viên Sân khấu và Điện ảnh (Hệ Cao đẳng) tại Trường ĐH Sân khấu Điện ảnh Hà Nội. Từ 2000 đến nay là diễn viên kịch nói Đoàn Kịch Cổ điển tại Nhà hát Kịch Việt Nam.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            { year: 2001, title: "Cánh cửa hy vọng", author: "Nguyễn Khắc Phục", director: "NSND Doãn Hoàng Giang" },
            { year: 2002, title: "Vụ án con rùa", author: "Lê Phương – Thanh Nhã", director: "NSND Lê Hùng" },
            { year: 2003, title: "Matsu – kẻ sống ngoài vòng pháp luật", author: "Iwashita Synshaku (Nhật Bản)", director: "NSƯT Tú Mai" },
            { year: 2004, title: "Bến mê", author: "Phan Thị Thu Loan", director: "NSND Trọng Khôi" },
            { year: 2005, title: "Trên cả trời xanh", author: "Nguyễn Mạnh Tuấn", director: "NSND Ngọc Giàu" },
            { year: 2005, title: "Người mắc bệnh tâm thần", author: "Thiều Hạnh Nguyên", director: "NSND Tuấn Hải" },
            { year: 2006, title: "Bà tỉ phú về thăm quê", author: "Duren Mac", director: "Rudo Traub" },
            { year: 2008, title: "Cuội buôn quan (vai Mô)", author: "Đỗ Minh Tuấn", director: "NSND Lê Hùng" },
            { year: 2008, title: "Linh hồn đông lạnh", author: "Nguyễn Hiếu", director: "NSƯT Đỗ Kỷ" },
            { year: 2008, title: "Mùa hạ cay đắng (trích đoạn - vai Ông già mù)", author: "Nguyễn Quang Lập" },
            { year: 2009, title: "Mỹ nhân và anh hùng", author: "Chu Thơm", director: "NSND Lê Hùng" },
            { year: 2009, title: "Trên cả trời xanh", author: "Nguyễn Mạnh Tuấn", director: "NSND Ngọc Giàu" },
            { year: 2010, title: "Bà chúa Tuyết", author: "Kim Chung", director: "NSND Tuấn Hải" },
            { year: 2011, title: "Đêm của bóng tối", author: "Lê Chí Trung", director: "NSND Lê Hùng – NSƯT Bạch Lan" },
            { year: 2011, title: "Hàng rào của hai nhà (vai Ông Ấm)", author: "Nguyễn Hiếu", director: "NSND Lê Hùng" },
            { year: 2014, title: "Lâu đài cát", author: "Đăng Chương", director: "NSND Anh Tú" },
            { year: 2014, title: "Trong mưa dông thấy nắng (vai Hải thần chết)", author: "Lê Chí Trung", director: "NSND Anh Tú" },
            { year: 2014, title: "Chuyện chàng dũng sĩ (vai Cây ông)", author: "Phóng tác từ sử thi Đam San", director: "NSND Anh Tú" },
            { year: 2014, title: "Đám cưới con gái Chuột (vai Bức tường)", author: "Chua Soo Pong (Singapo)" },
            { year: 2015, title: "Hamlet (vai Rôđencran)", author: "W. Shakespeare", director: "NSND Anh Tú" },
            { year: 2015, title: "Con gà trống", author: "Chua Soo Pong (Singapo)" },
            { year: 2016, title: "Khát vọng (vai Cát)", author: "Tạ Xuyên", director: "NSƯT Lâm Tùng" },
            { year: 2016, title: "Lão hà tiện (vai Bác cả Giắc)", author: "Môlie", director: "NSND Tuấn Hải" },
            { year: 2016, title: "Bão tố Trường Sơn (vai Trường Tân)", author: "Trương Minh Phương", director: "NSND Anh Tú" },
            { year: 2018, title: "Thế sự", author: "Lê Chí Trung", director: "NSND Anh Tú" },
            { year: 2019, title: "Điều còn lại (vai Ông Ánh)", author: "Đăng Chương", director: "NSƯT Minh Hiếu" },
            { year: 2020, title: "Ông cụ ở quê ra (vai Bác Hồ)", author: "Trần Đăng Tuấn", director: "NSƯT Minh Hiếu và NSƯT Mai Nguyên" },
            { year: 2020, title: "Chị em ngày gặp lại (vai Bác Hồ)", author: "Trần Đăng Tuấn", director: "NSƯT Minh Hiếu và NSƯT Mai Nguyên" },
            { year: 2020, title: "Đêm trắng (vai Chủ tịch Hồ Chí Minh)", author: "Lưu Quang Hà", director: "NSƯT Xuân Bắc" },
            { year: 2021, title: "Thiên mệnh (vai Trần An Quốc)", author: "Hoàng Thanh Du", director: "NSƯT Đỗ Kỷ" },
            { year: 2022, title: "Bác Hồ và mùa xuân năm ấy (vai Bác Hồ)", author: "Lê Trinh", director: "NSƯT Phương Nga" },
            { year: 2022, title: "Đoàn kết là sức mạnh (vai Bác Hồ)", author: "Lê Trinh", director: "NSƯT Lâm Tùng" }
        ],
        
        // Phim đã tham gia
        films: [
            { year: 2010, title: "Vượt qua bến Thượng Hải (vai Nguyễn Ái Quốc)", director: "Triệu Tuấn – Phạm Đông Vũ" },
            { year: 2014, title: "Nhà tiên tri (vai Thủ tướng Phạm Văn Đồng)", director: "Vương Đức" },
            { year: 2015, title: "Cuộc đời của Yến (vai Bố của Yến)", director: "Đinh Tuấn Vũ" },
            { year: 2016, title: "Ý chí độc lập (19 tập, vai Bác Hồ)", director: "NSƯT Bùi Cường" },
            { year: 2019, title: "Truyền thuyết Quán Tiên (vai Binh trạm trưởng Lâm)", director: "Đinh Tuấn Vũ" },
            { year: 2019, title: "Nước mắt rừng Pắc Bó (vai Chủ tịch Hồ Chí Minh - Ông Ké Thu)", director: "Đinh Quốc Bình" },
            { year: 2020, title: "Câu chuyện pháp sư (vai Thầy giáo Tường Văn)", director: "Jack Carry" },
            { year: 2020, title: "Muôn vàn tình thương yêu (vai Chủ tịch Hồ Chí Minh)", director: "NSƯT Lê Thụy" },
            { year: 2020, title: "Bác Hồ một tình yêu bao la (vai Chủ tịch Hồ Chí Minh)", director: "NSƯT Xuân Bắc" }
        ],
        
        // Thành tích - Giải cá nhân
        achievements: [
            { year: 2015, achievement: "Huy chương Bạc (Cá nhân) Liên hoan nghệ thuật Sân khấu toàn quốc 'Hình tượng người chiến sĩ công an nhân dân' lần thứ 3 vai thứ chính: Phạm nhân Hải vở 'Trong mưa dông thấy nắng'" },
            { year: 2016, achievement: "Huy chương Bạc (Cá nhân) Liên hoan Sân khấu Thủ đô lần thứ 2 Vai chính: Cát vở 'Khát vọng'" },
            { year: 2020, achievement: "Giải diễn viên xuất sắc (Cá nhân) Vai chính: Bác Hồ vở 'Đêm trắng'" },
            { year: 2021, achievement: "Huy chương Vàng (Cá nhân) Liên hoan Kịch nói toàn quốc Vai chính: Trần An Quốc vở 'Thiên mệnh'" }
        ],
        
        // Thành tích - Giải tập thể
        groupAchievements: [
            { year: 2010, achievement: "Huy chương Vàng Liên hoan Truyền hình toàn quốc năm 2010 Vai chính: Bác Hồ Kịch truyền hình 'Nước mắt rừng Pắc Bó'" },
            { year: 2015, achievement: "Huy chương Vàng Cuộc thi Nghệ thuật Sân khấu Kịch nói chuyên nghiệp toàn quốc năm 2015 vở 'Lâu đài cát'" },
            { year: 2015, achievement: "Bông sen Bạc Liên hoan Phim Việt Nam lần thứ 19 Vai chính: Bố của Yến Phim điện ảnh 'Cuộc đời của Yến'" },
            { year: 2016, achievement: "Cánh diều Bạc Lễ trao giải Cánh diều năm 2016 Vai chính: Bố của Yến Phim điện ảnh 'Cuộc đời của Yến'" },
            { year: 2018, achievement: "Huy chương Vàng Liên hoan Kịch nói toàn quốc năm 2018 Vai phụ: Trường Tân Vở diễn 'Bão tố Trường Sơn'" },
            { year: 2019, achievement: "Bông sen Bạc Liên hoan Phim Việt Nam lần thứ 21 Vai chính: Binh trạm trưởng Lâm Phim điện ảnh 'Truyền thuyết Quán Tiên'" },
            { year: 2021, achievement: "Huy chương Vàng (Tập thể) Liên hoan Kịch nói toàn quốc Vai thứ: Ông Ánh Vở diễn 'Điều còn lại'" }
        ]
    },
    {
        id: 11,
        name: "NS Hồ Liên",
        slug: "ns-ho-lien",
        fullName: "Hồ Liên",
        
        // Thông tin cơ bản
        education: "Đại học Sân Khấu Điện Ảnh (học cùng lớp với Xuân Bắc)",
        
        // Chức vụ
        positions: [
            { title: "Phó đoàn đương đại", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/holien.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Nghệ sĩ Hồ Liên – Táo Giáo dục của chương trình Táo quân 2014 hay còn được biết đến với biệt danh 'cô Cam vui vẻ' và đang giữ chức phó đoàn đương đại của Nhà hát Kịch Việt Nam. Chị cũng từng sinh viên của ngôi trường Đại học Sân Khấu Điện Ảnh, học cùng lớp với Xuân Bắc.",
        
        // Quote
        quotes: [
            "Hôm tôi đi đám cưới Hải Phòng, đang ngồi ăn ngon lành thì bị mọi người 'quát': 'Cam! đứng dậy dọn dẹp đi chứ ngồi ăn thế à'.",
            "Hôm tôi vào trường quay Đài truyền hình, các em đang chuẩn bị thực hiện chương trình thiếu nhi bỗng đồng thanh kêu: 'Chúng cháu chào cô Cam ạ', rồi chạy lại 'sờ' xem cô thế nào khiến tôi vô cùng… ngượng.",
            "Vai hiền hiền thì ít người nhớ tới lắm, có lẽ tôi có duyên với những vai chanh chua."
        ],
        
        // Phong cách
        style: "Diễn đạt, hợp vai những vai có phần chanh chua nên NS Hồ Liên thường được các đạo diễn tin tưởng giao những vai tính cách, sắc sảo nhưng khá đanh đá.",
        
        // Vai diễn nổi bật
        notableRoles: [
            { role: "Táo Giáo dục", production: "Táo quân 2014" },
            { role: "Cô Cam", production: "Những người độc thân vui vẻ" }
        ],
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Nghêu, Sò, Ốc, Hến (vai Vợ quan huyện - 2022)"
        ],
        
        // Phim đã tham gia
        films: [
            "Đất và người",
            "Gió từ phố Hiến"
        ],
        
        // Sự kiện quan trọng
        milestones: [
            { date: "2014", event: "Tham gia Táo quân với vai Táo Giáo dục" }
        ]
    },
    {
        id: 12,
        name: "Lê Thị Tuyết Trinh",
        slug: "le-thi-tuyet-trinh",
        fullName: "Lê Thị Tuyết Trinh",
        
        // Thông tin cơ bản
        birthDate: "07/09/1994",
        birthYear: 1994,
        education: "Đại học Sân khấu Điện ảnh Hà Nội (2016)",
        
        // Nơi công tác
        organization: "Đoàn kịch Đương Đại - Nhà hát Kịch Việt Nam",
        
        // Quá trình công tác
        workHistory: [
            { period: "21/06/2016 - nay", position: "Diễn viên", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Social
        social: {
            facebook: "https://www.facebook.com/tuyettrinh.nguyen.1654"
        },
        
        // Ảnh đại diện
        avatar: "/Artists/tuyettrinh.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Họ và tên: Lê Thị Tuyết Trinh, sinh ngày 07/09/1994. Năm 2016 tốt nghiệp trường đại học sân khấu điện ảnh HN. Bắt đầu về nhà hát từ ngày 21/6/2016 đến nay.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Biệt đội báo đen",
            "Bão tố trường sơn",
            "Nhà 5 anh em trai",
            "Người tốt nhà số 5",
            "Nguồn sáng trong đời",
            "Người mẹ trước vành móng ngựa",
            "Điều Còn Lại",
            "Thế sự",
            "Đêm trắng"
        ],
        
        // Phim đã tham gia
        films: [
            { title: "Thung Ma", type: "Phim điện ảnh" },
            { title: "Sống chậm", type: "Sitcom" },
            { title: "1 phút cả cuộc đời", type: "Sitcom" }
        ],
        
        // Thành tích
        achievements: [
            { year: 2020, achievement: "Huy chương Vàng tài năng trẻ" },
            { year: 2021, achievement: "Huy chương Bạc liên hoan sân khấu toàn quốc" }
        ]
    },
    {
        id: 13,
        name: "Thế Nguyên",
        slug: "the-nguyen",
        fullName: "Ngô Thế Nguyên",
        
        // Thông tin cơ bản
        birthDate: "12/10/1991",
        birthYear: 1991,
        education: "Đại học Sân khấu Điện ảnh (ngành Diễn viên Sân khấu - Điện ảnh)",
        
        // Quá trình công tác
        workHistory: [
            { period: "2013 - nay", position: "Diễn viên", organization: "Nhà hát Kịch Việt Nam" }
        ],
        
        // Ảnh đại diện
        avatar: "/Artists/thenguyen.jpg",
        images: [],
        
        // Giới thiệu
        bio: "Nghệ sĩ Thế Nguyên tên thật là Ngô Thế Nguyên, sinh ngày 12/10/1991. Anh đã từng theo học ngành Diễn viên Sân khấu - Điện ảnh của trường Đại học Sân khấu Điện ảnh, sau đó công tác tại Nhà hát Kịch Việt Nam từ năm 2013 đến nay.",
        
        // Quote
        quote: "Khẳng định giá trị bản thân trong công việc là mục tiêu hàng đầu của tôi. Trong những năm tiếp theo, với những kinh nghiệm đã có, sự cố gắng trau dồi kiến thức và sự đam mê, tôi quyết tâm đưa mình tới đỉnh cao của nghệ thuât.",
        
        // Các vở diễn đã tham gia
        stagePlays: [
            "Vụ án am bụt mọc",
            "Như thế là tội ác",
            "Người mẹ trước vành móng ngựa",
            "Nghêu, sò, ốc, hến",
            "Bão tố Trường Sơn",
            "Hamlet",
            "Bệnh sĩ"
        ],
        
        // Phim đã tham gia
        films: [
            "Truyền thuyết về quán Tiên",
            "Sống chung với mẹ chồng",
            "Khép mắt chờ ngày mai",
            "Thương ngày nắng về"
        ],
        
        // Thành tích - Giải cá nhân
        achievements: [
            { year: 2020, achievement: "Huy chương Vàng vai 'Hiệp' vở 'Người tốt nhà số 5' tại Liên hoan sân khấu Thủ đô lần thứ IV năm 2020" },
            { achievement: "Huy chương Bạc Tài năng trẻ Sân khấu Kịch nói Toàn quốc" }
        ],
        
        // Thành tích - Giải tập thể
        groupAchievements: [
            { achievement: "Huy chương Vàng vở 'Bão tố Trường Sơn'" },
            { achievement: "Huy chương Vàng vở 'Thiên mệnh'" },
            { achievement: "Huy chương Bạc vở 'Kiều'" }
        ]
    }
];

export default artistsData;