const newsData = [
    {
        id: 1,
        title: "NSƯT TRỊNH MAI NGUYÊN ĐƯỢC BỔ NHIỆM LÀM PHÓ GIÁM ĐỐC NHÀ HÁT KỊCH VIỆT NAM",
        slug: "nsut-trinh-mai-nguyen-duoc-bo-nhiem-lam-pho-giam-doc",

        // Thông tin cơ bản
        author: "NHK",
        authorInfo: "Phòng Truyền thông",
        date: "21 Tháng 01, 2026",
        dateISO: "2026-01-21",
        category: "Các hoạt động của nhà hát",
        categorySlug: "hoat-dong-nha-hat",

        // Ảnh đại diện - ĐÃ SỬA
        image: "/News/lecongbo.jpg",
        imageCaption: "NSƯT Trịnh Mai Nguyên tại lễ bổ nhiệm",

        // Mô tả ngắn
        excerpt: "Sáng ngày 21/01/2026, tại trụ sở Bộ Văn hóa, Thể thao và Du lịch, NSƯT Trịnh Mai Nguyên - Trưởng đoàn kịch Đương đại chính thức được bổ nhiệm giữ chức vụ Phó Giám đốc Nhà hát Kịch Việt Nam...",

        // Gallery
        gallery: [],

        // Nội dung chi tiết
        content: [
            {
                type: "paragraph",
                text: "Sáng ngày 21/01/2026, tại trụ sở Bộ Văn hóa, Thể thao và Du lịch, NSƯT Trịnh Mai Nguyên - Trưởng đoàn kịch Đương đại chính thức được bổ nhiệm giữ chức vụ Phó Giám đốc Nhà hát Kịch Việt Nam, đánh dấu cột mốc quan trọng trong chặng đường cống hiến bền bỉ của anh đối với nghệ thuật sân khấu kịch nói nước nhà."
            },
            {
                type: "heading",
                text: "🎭 Dấu ấn nghệ thuật",
                level: 3
            },
            {
                type: "paragraph",
                text: "Là một nghệ sĩ trưởng thành từ thực tiễn sân khấu, bên cạnh vai diễn để lại nhiều dấu ấn đặc biệt – Đại tướng Võ Nguyên Giáp, NSƯT Trịnh Mai Nguyên còn khẳng định tài năng qua hàng loạt vở diễn được khán giả và giới chuyên môn ghi nhận như: Nghêu Sò Ốc Hến, Lâu đài cát, Hồn Trương Ba da hàng thịt, Thế sự… Không chỉ tỏa sáng trên sân khấu với vai trò diễn viên, anh còn thể hiện dấu ấn sáng tạo trong vai trò đạo diễn qua các tác phẩm: Người trong cõi nhớ, Như thế là tội ác…, cho thấy tư duy nghệ thuật nghiêm túc, đa chiều và sự bền bỉ trong hành trình cống hiến cho sân khấu kịch nói."
            },
            {
                type: "heading",
                text: "✨ Ghi nhận và kỳ vọng",
                level: 3
            },
            {
                type: "paragraph",
                text: "Việc bổ nhiệm NSƯT Trịnh Mai Nguyên giữ cương vị Phó Giám đốc Nhà hát Kịch Việt Nam thể hiện sự ghi nhận của lãnh đạo Bộ Văn hóa, Thể thao và Du lịch cũng như của Nhà hát đối với những đóng góp lâu dài của anh cho đơn vị. Đồng thời, đây cũng là sự kỳ vọng vào một thế hệ lãnh đạo nghệ sĩ vừa vững chuyên môn, vừa thấu hiểu đời sống sáng tạo của sân khấu."
            },
            {
                type: "heading",
                text: "💥 Sứ mệnh mới",
                level: 3
            },
            {
                type: "paragraph",
                text: "Trên cương vị mới, NSƯT Trịnh Mai Nguyên được kỳ vọng sẽ tiếp tục cùng Ban Giám đốc Nhà hát Kịch Việt Nam phát huy truyền thống của đơn vị kịch nói hàng đầu, đồng thời góp phần đổi mới tư duy nghệ thuật, nâng cao chất lượng vở diễn, đưa sân khấu kịch đến gần hơn với công chúng, đặc biệt là khán giả trẻ."
            },
            {
                type: "heading",
                text: "💐 Lời kết",
                level: 3
            },
            {
                type: "paragraph",
                text: "Sự kiện này không chỉ là niềm vui riêng của cá nhân NSƯT Trịnh Mai Nguyên mà còn là niềm phấn khởi chung của tập thể Nhà hát Kịch Việt Nam – nơi đang từng bước khẳng định vị thế là một trong những đơn vị nghệ thuật hàng đầu của cả nước."
            }
        ],

        // Tags
        tags: ["#NhahatKichVietNam", "#PGĐTrinhMaiNguyen"],

        // Thông tin liên hệ
        contact: {
            theater: "NHÀ HÁT KỊCH VIỆT NAM",
            address: "Số 01 Tràng Tiền, Cửa Nam, Hà Nội",
            contacts: [
                { role: "Phụ trách truyền thông", name: "Minh Trí" },
                { role: "Phụ trách CSKH", name: "Lê Hoài Anh" }
            ],
            phone: "024.3933.3535 - 0889.67.67.67",
            zalo: "https://zalo.me/1543673456404778136",
            website: "https://nhahatkichvietnam.vn/",
            email: "nhahatkichvietnam.nhkvn@gmail.com"
        },

        // Các nội dung chính
        mainContent: [
            { title: "Giới thiệu", link: "#gioi-thieu" },
            { title: "Dấu ấn nghệ thuật", link: "#dau-an-nghe-thuat" },
            { title: "Kỳ vọng mới", link: "#ky-vong-moi" }
        ]
    },
    {
        id: 2,
        title: "DẤU ẤN RỰC RỠ: NHÀ HÁT KỊCH VIỆT NAM TỎA SÁNG TẠI LIÊN HOAN QUỐC TẾ SÂN KHẤU THỬ NGHIỆM LẦN THỨ VI - 2025",
        slug: "dau-an-ruc-ro-nha-hat-kich-viet-nam-toa-sang-tai-lien-hoan-quoc-te-san-khau-thu-nghiem",

        // Thông tin cơ bản
        author: "NHK",
        date: "02 Tháng 12, 2025",
        dateISO: "2025-12-02",
        category: "Tin tức biểu diễn nghệ thuật",
        categorySlug: "bieu-dien-nghe-thuat",

        // Ảnh đại diện - ĐÃ SỬA
        image: "/News/dauanrucro.jpg",
        imageCaption: "Lễ bế mạc Liên hoan Quốc tế Sân khấu thử nghiệm lần thứ VI - 2025",

        // Mô tả ngắn
        excerpt: "Tối ngày 30/11/2025, tại Nhà hát Phạm Thị Trân (tỉnh Ninh Bình) đã diễn ra lễ bế mạc Liên hoan Quốc tế Sân khấu thử nghiệm lần thứ VI - 2025. Nhà hát Kịch Việt Nam tham gia với vở diễn 'Người đi dép cao su' và giành nhiều giải thưởng cao quý.",

        // Gallery
        gallery: [],

        // Nội dung chi tiết
        content: [
            {
                type: "paragraph",
                text: "💫 Tối ngày 30/11/2025, tại Nhà hát Phạm Thị Trân (tỉnh Ninh Bình) đã diễn ra lễ bế mạc Liên hoan Quốc tế Sân khấu thử nghiệm lần thứ VI - 2025."
            },
            {
                type: "heading",
                text: "✨ Thành phần tham dự",
                level: 3
            },
            {
                type: "paragraph",
                text: "Đến với lễ bế mạc có sự góp mặt của các đại biểu:"
            },
            {
                type: "list",
                items: [
                    "Đ/c Phan Tâm: Thứ trưởng Bộ Văn hóa, Thể thao và Du lịch",
                    "Đ/c Cao Xuân Thu Vân: Chủ tịch Liên minh Hợp tác xã Việt Nam",
                    "NSND Nguyễn Xuân Bắc: Cục trưởng Cục Nghệ thuật biểu diễn",
                    "TS Trần Thị Phương Lan: Vụ trưởng Vụ Văn hóa văn nghệ, Ban Tuyên giáo và dân vận Trung ương",
                    "NSND Trịnh Thúy Mùi: Chủ tịch Hội Nghệ sĩ Sân khấu Việt Nam",
                    "Đ/c Trần Song Tùng: Ủy viên Ban Thường vụ Tỉnh ủy, Phó Chủ tịch thường trực UBND tỉnh Ninh Bình",
                    "Đại diện lãnh đạo của các Nhà hát, đơn vị nghệ thuật tham gia Liên hoan"
                ]
            },
            {
                type: "image",
                src: "/News/lien-hoan-3.jpg",
                caption: "Các đại biểu tham dự lễ bế mạc"
            },
            {
                type: "heading",
                text: "🎭 Vở diễn tham gia",
                level: 3
            },
            {
                type: "paragraph",
                text: "Nhà hát Kịch Việt Nam tham gia Liên hoan lần này với vở diễn “Người đi dép cao su” của tác giả Kateb Yacine do Đạo diễn: TS. NGƯT Lê Mạnh Hùng dàn dựng."
            },
            {
                type: "paragraph",
                text: "Đây là một vở diễn được đánh giá có cách dàn dựng mới lạ, không tuân theo những quy ước truyền thống của sân khấu kịch, kể lại biên niên sử về công cuộc đấu tranh giành độc lập, tự do của dân tộc Việt Nam. Vở “Người đi dép cao su” của Nhà hát Kịch Việt Nam được Liên hoan đánh giá là vở diễn mang lại nhiều cảm xúc, những lớp diễn ấn tượng và đặc biệt đã xây dựng thành công hình tượng của các nhân vật trong lịch sử Việt Nam."
            },
            {
                type: "heading",
                text: "👏 Giải thưởng đạt được",
                level: 3
            },
            {
                type: "paragraph",
                text: "Kết thúc Liên hoan, vở “Người đi dép cao su” xuất sắc giành được những giải thưởng sau:"
            },
            {
                type: "list",
                items: [
                    "🥇 GIẢI VỞ DIỄN XUẤT SẮC: Vở diễn \"Người đi dép cao su\" - Nhà hát Kịch Việt Nam",
                    "🥇 GIẢI CÁ NHÂN:",
                    "   - Giải Đạo diễn xuất sắc: TS. NGƯT Lê Mạnh Hùng",
                    "   - Giải Biên đạo xuất sắc: NSND Kiều Lê - Hà Hằng",
                    "   - Giải Thiết kế Ánh sáng xuất sắc: Thanh Hà - Như Quỳnh",
                    "🥇 HUY CHƯƠNG VÀNG:",
                    "   - NS Minh Hải: thể hiện hình tượng Chủ tịch Hồ Chí Minh",
                    "   - NSƯT Trịnh Mai Nguyên: thể hiện hình tượng Đại tướng Võ Nguyên Giáp"
                ]
            },
            {
                type: "paragraph",
                text: "👏 Xin chúc mừng tập thể Nhà hát Kịch Việt Nam với những thành công vang dội tại Liên hoan lần này. Hãy cùng chúng tôi nhìn lại những khoảnh khắc đáng nhớ tại đêm trao giải."
            }
        ],

        // Tags
        tags: ["#NhàhátKịchViệtNam", "#Ngườiđidépcaosu", "#Sânkhấuthửnghiệm"],

        // Thông tin liên hệ
        contact: {
            theater: "NHÀ HÁT KỊCH VIỆT NAM",
            address: "Số 01 Tràng Tiền, Cửa Nam, Hà Nội",
            contacts: [
                { role: "Phụ trách truyền thông", name: "Minh Trí" },
                { role: "Phụ trách CSKH", name: "Lê Hoài Anh" }
            ],
            phone: "024.3933.3535 - 0889.67.67.67",
            zalo: "https://zalo.me/1543673456404778136",
            website: "https://nhahatkichvietnam.vn/",
            email: "nhahatkichvietnam.nhkvn@gmail.com"
        }
    },
    {
        id: 3,
        title: "HIỆU ỨNG KHÁN GIẢ TỪ CHƯƠNG TRÌNH 'ÂM VANG NGƯỜI LÍNH'",
        slug: "hieu-ung-khan-gia-tu-chuong-trinh-am-vang-nguoi-linh",

        // Thông tin cơ bản
        author: "NHK",
        authorInfo: "Phòng Truyền thông",
        date: "17 Tháng 11, 2025",
        dateISO: "2025-11-17",
        category: "Tin tức biểu diễn nghệ thuật",
        categorySlug: "bieu-dien-nghe-thuat",

        // Ảnh đại diện - ĐÃ SỬA
        image: "/News/amvang1.jpg",
        imageCaption: "Chương trình nghệ thuật 'Âm vang người lính'",

        // Mô tả ngắn
        excerpt: "Ngay từ những suất diễn đầu tiên, chương trình nghệ thuật Âm vang người lính do Nhà hát Kịch Việt Nam thực hiện đã tạo nên hiệu ứng đặc biệt, chạm vào cảm xúc của nhiều thế hệ khán giả.",

        // Gallery - ĐÃ SỬA
        gallery: [
            {
                src: "/News/amvang2.jpg",
                caption: "Rất nhiều khán giả trẻ đến xem kịch"
            },
            {
                src: "/News/amvang3.jpeg",
                caption: "Vở kịch 'Bão tố Trường Sơn'"
            },
            {
                src: "/News/amvang4.jpeg",
                caption: "Vở kịch 'Đêm trắng'"
            }
        ],

        // Nội dung chi tiết
        content: [
            {
                type: "paragraph",
                text: "Ngay từ những suất diễn đầu tiên, chương trình nghệ thuật Âm vang người lính do Nhà hát Kịch Việt Nam thực hiện đã tạo nên hiệu ứng đặc biệt, chạm vào cảm xúc của nhiều thế hệ khán giả. Không cần thống kê hay mô tả từng đêm diễn, chính những phản hồi chân thành, giọt nước mắt rưng, những khoảng lặng kéo dài sau khi màn nhung khép lại đã đủ minh chứng cho sức lan tỏa của dự án sân khấu giàu tính nhân văn này."
            },
            {
                type: "heading",
                text: "Kết nối quá khứ, lay động hiện tại",
                level: 2
            },
            {
                type: "paragraph",
                text: "Dự án gồm ba vở diễn: Đêm trắng, Biệt đội Báo Đen và Bão tố Trường Sơn, mỗi tác phẩm là một lát cắt sinh động về chặng đường chiến đấu của dân tộc."
            },
            {
                type: "paragraph",
                text: "Đêm trắng mang sắc thái bi tráng của thời kháng chiến chống Pháp; Biệt đội Báo Đen khắc họa tinh thần quả cảm, bình dị mà kiên cường của người lính; còn Bão tố Trường Sơn tái hiện những tháng ngày thanh xuân rực lửa của những cô gái thanh niên xung phong nơi tuyến lửa huyền thoại."
            },
            {
                type: "paragraph",
                text: "Dưới bàn tay đạo diễn của NSND Xuân Bắc, cùng di sản nghệ thuật của NSND Anh Tú và sự chỉ đạo thực hiện của NSƯT Kiều Minh Hiếu, Âm vang người lính trở thành một không gian sân khấu đa tầng: âm thanh, ánh sáng, kỹ thuật trình chiếu, diễn xuất hòa quyện, mở ra trường cảm xúc mạnh mẽ đối với người xem. Không chỉ kể lại câu chuyện của quá khứ, mỗi vở diễn còn thổi vào đó hơi thở của hôm nay, giúp khán giả thấy gần gũi, thấu hiểu và biết ơn hơn những người đã đi trước."
            },
            {
                type: "image",
                src: "/News/amvang2.jpg",
                caption: "Rất nhiều khán giả trẻ đến xem kịch"
            },
            {
                type: "paragraph",
                text: "Âm vang người lính còn ghi dấu mạnh mẽ nhờ dàn nghệ sĩ tài năng của Nhà hát Kịch Việt Nam – những gương mặt quen thuộc với công chúng truyền hình và là những 'chiến binh' thực sự trên sân khấu. Sự tham gia của NSND Xuân Bắc, NSND Lâm Tùng, NSND Tạ Tuấn Minh, cùng các NSƯT Kiều Minh Hiếu, NSƯT Trịnh Mai Nguyên, NSƯT Dũng Nam, NSƯT Khuất Quỳnh Hoa, NSƯT Mai Hương, Hồ Liên, Hồng Phúc, Việt Hoa, Tô Dũng, Minh Hải... đã tạo nên những vai diễn giàu chiều sâu, thấm đẫm tinh thần trách nhiệm với đề tài lịch sử, mang đến những hình tượng sân khấu chân thực, sinh động, giúp khán giả cảm nhận rõ hơi thở nóng bỏng của các nhân vật."
            },
            {
                type: "paragraph",
                text: "Sự hòa quyện giữa thế hệ nghệ sĩ giàu kinh nghiệm và lớp kế cận đầy nội lực đã thổi sức sống mới vào chương trình, kéo gần khoảng cách giữa câu chuyện chiến tranh và cảm xúc người xem hôm nay."
            },
            {
                type: "heading",
                text: "Giá trị của sân khấu: khi người xem không chỉ xem mà còn cảm",
                level: 2
            },
            {
                type: "paragraph",
                text: "Khi ánh đèn sân khấu khép lại, điều còn vang lên không chỉ là tiếng nhạc, mà là tiếng nấc lặng trong lòng người xem. Những khoảnh khắc khán giả im lặng rất lâu trước khi rời ghế, những bạn trẻ lặng lẽ lau nước mắt hay những tràng pháo tay không ngớt khi diễn viên cúi chào… chính là thước đo chân thực nhất về sức hút của chương trình. Những cảm xúc ấy không đến từ chiêu trò, mà từ sự chân thành, tinh thần nhân ái và sức mạnh của ký ức cộng đồng được đánh thức."
            },
            {
                type: "image",
                src: "/News/amvang3.jpeg",
                caption: "Vở kịch 'Bão tố Trường Sơn'"
            },
            {
                type: "paragraph",
                text: "Trong bối cảnh sân khấu chính luận vẫn được cho là kén khán giả, Âm vang người lính đã chứng minh rằng chỉ cần chạm đúng vào cảm xúc cộng đồng, sân khấu vẫn có thể lay động mạnh mẽ. Khán giả không chỉ đến để thưởng thức nghệ thuật, mà còn để tìm lại một phần ký ức của dân tộc, ký ức mà trong nhịp sống hiện đại đôi khi bị lùi vào phía sau."
            },
            {
                type: "paragraph",
                text: "Âm vang người lính đánh thức trong người xem sự trân trọng đối với thế hệ đi trước, những con người đã lấy tuổi trẻ đánh đổi bình yên đất nước. Bằng nghệ thuật, chương trình đưa khán giả trở về một thời gian khó nhưng đáng tự hào, để từ đó sống đẹp hơn và biết ơn hơn."
            },
            {
                type: "paragraph",
                text: "Âm vang người lính không chỉ tái hiện lịch sử, mà còn đánh thức ký ức cộng đồng, kết nối quá khứ với hiện tại bằng chiều sâu cảm xúc hiếm có."
            },
            {
                type: "image",
                src: "/News/amvang4.jpeg",
                caption: "Vở kịch 'Đêm trắng'"
            },
            {
                type: "paragraph",
                text: "Điều đáng quý nhất ở Âm vang người lính không chỉ là câu chuyện chiến tranh được kể bằng ngôn ngữ sân khấu, mà là khả năng khiến khán giả tự đối thoại với chính mình. Khi rời khỏi rạp, người xem không chỉ nhớ về những câu thoại hay hình ảnh ấn tượng, mà mang theo một niềm xúc động lặng lẽ, thứ cảm xúc khiến họ muốn sống nhân ái hơn, trân trọng hòa bình hơn và biết quý trọng gia đình, đất nước."
            },
            {
                type: "paragraph",
                text: "Trong dòng chảy nghệ thuật đương đại, không phải tác phẩm nào cũng có thể lưu lại dư âm trong lòng người xem. Và chính điều đó làm cho Âm vang người lính trở thành dấu ấn đẹp của sân khấu Việt Nam hôm nay: một chương trình không chạy theo thị hiếu nhất thời, mà hướng tới những giá trị bền vững, làm sáng lên ký ức lịch sử bằng sự chân thành và lòng biết ơn."
            }
        ],

        // Tags
        tags: ["#ÂmVangNgườiLính", "#NhàHátKịchViệtNam", "#SânKhấuLịchSử"],

        // Thông tin liên hệ
        contact: {
            theater: "NHÀ HÁT KỊCH VIỆT NAM",
            address: "Số 01 Tràng Tiền, Cửa Nam, Hà Nội",
            contacts: [
                { role: "Phụ trách truyền thông", name: "Minh Trí" },
                { role: "Phụ trách CSKH", name: "Lê Hoài Anh" }
            ],
            phone: "024.3933.3535 - 0889.67.67.67",
            zalo: "https://zalo.me/1543673456404778136",
            website: "https://nhahatkichvietnam.vn/",
            email: "nhahatkichvietnam.nhkvn@gmail.com"
        }
    },
    {
        id: 4,
        title: "CHUỖI CHƯƠNG TRÌNH NGHỆ THUẬT 'ÂM VANG NGƯỜI LÍNH'",
        slug: "chuoi-chuong-trinh-nghe-thuat-am-vang-nguoi-linh",

        // Thông tin cơ bản
        author: "NHK",
        authorInfo: "Phòng Truyền thông",
        date: "12 Tháng 11, 2025",
        dateISO: "2025-11-12",
        category: "Tin tức biểu diễn nghệ thuật",
        categorySlug: "bieu-dien-nghe-thuat",

        // Ảnh đại diện - ĐÃ SỬA
        image: "/News/chuoiamvang1.jpg",
        imageCaption: "Poster chuỗi chương trình 'Âm vang người lính'",

        // Mô tả ngắn
        excerpt: "ANTD.VN - Nhà hát Kịch Việt Nam giới thiệu chuỗi chương trình nghệ thuật đặc biệt mang tên 'Âm vang người lính' biểu diễn tại Nhà hát Kịch Việt Nam (01 Tràng Tiền, Hà Nội) với các vở: Biệt đội Báo Đen, Bão tố Trường Sơn và Đêm trắng.",

        // Gallery - ĐÃ SỬA
        gallery: [
            {
                src: "/News/chuoiamvang2.avif",
                caption: "Cảnh trong vở 'Biệt đội báo đen'"
            },
            {
                src: "/News/chuoiamvang3.avif",
                caption: "Cảnh trong vở 'Bão tố Trường Sơn'"
            }
        ],

        // Nội dung chi tiết
        content: [
            {
                type: "paragraph",
                text: "ANTD.VN - Nhà hát Kịch Việt Nam giới thiệu chuỗi chương trình nghệ thuật đặc biệt mang tên 'Âm vang người lính' biểu diễn tại Nhà hát Kịch Việt Nam (01 Tràng Tiền, Hà Nội) với các vở: Biệt đội Báo Đen (20h00 ngày 08.11 và 15.11.2025), Bão tố Trường Sơn (20h00 ngày 06.12 và 13.12.2025), và Đêm trắng (20h00 ngày 29.11 và 20.12.2025)."
            },
            {
                type: "heading",
                text: "Đêm trắng - Bức tranh kháng chiến chống Pháp",
                level: 3
            },
            {
                type: "paragraph",
                text: "Mở màn chuỗi sự kiện là vở Đêm trắng của cố tác giả Lưu Quang Hà, do NSND Xuân Bắc đạo diễn, tái hiện bức tranh kháng chiến chống Pháp thập niên 1950 với kịch tính và chiều sâu hiếm có. Dựa trên câu chuyện có thật về 'hũ gạo cứu đói, nhường cơm cho kháng chiến', vở kịch hé lộ những góc khuất giữa lý tưởng và cám dỗ, giữa hy sinh và hưởng lạc. Không chỉ tái hiện một thời bi tráng, Đêm trắng còn khiến người xem tự soi lại mình rằng giữa ánh sáng và bóng tối, ranh giới niềm tin mong manh đến nhói lòng."
            },
            {
                type: "heading",
                text: "Biệt đội Báo Đen - Hơi thở điện ảnh trên sân khấu",
                level: 3
            },
            {
                type: "paragraph",
                text: "Tiếp nối, Biệt đội Báo Đen của nhà văn Chu Lai, đạo diễn bởi NSND Anh Tú, mang hơi thở của điện ảnh hành động lên sân khấu. Những pha kịch tính, tiết tấu dồn dập được đan xen cùng cảm xúc nhân văn, làm nổi bật hình tượng người lính không chỉ chiến đấu ngoài chiến trường mà còn giữa đời thường, chống lại cái xấu và bóng tối trong chính xã hội hòa bình. Vở diễn như lời nhắc: cuộc chiến khốc liệt nhất, đôi khi, là giữ vững nhân cách giữa những biến động đời sống."
            },
            {
                type: "image",
                src: "/News/chuoiamvang2.avif",
                caption: "Cảnh trong vở 'Biệt đội báo đen'"
            },
            {
                type: "heading",
                text: "Bão tố Trường Sơn - Bản trường ca bi tráng",
                level: 3
            },
            {
                type: "paragraph",
                text: "Khép lại chương trình là Bão tố Trường Sơn cũng của cố đạo diễn NSND Anh Tú và tác giả Trương Minh Phương - một bản trường ca bi tráng về hàng vạn người lính và thanh niên xung phong đã ngã xuống trên con đường huyền thoại. Không sa đà bi lụy, vở diễn thắp lên triết lý nhân sinh sâu sắc: chiến tranh có thể qua đi, nhưng tình người và lòng biết ơn là điều còn lại mãi."
            },
            {
                type: "image",
                src: "/News/chuoiamvang3.avif",
                caption: "Cảnh trong vở 'Bão tố Trường Sơn'"
            },
            {
                type: "paragraph",
                text: "Thông tin từ Nhà hát Kịch Việt Nam cho biết, vé được đặt kín trước nhiều ngày. Người xem đến không chỉ để hoài niệm, mà để sống cùng lịch sử để thấy người lính không xa vời mà hiện hữu ngay trong từng hơi thở của cuộc đời hôm nay."
            },
            {
                type: "paragraph",
                text: "Sức hút ấy đến từ chính cách làm nghệ thuật nghiêm túc của Nhà hát Kịch Việt Nam: kịch bản được tuyển chọn kỹ lưỡng, dàn diễn viên giàu kinh nghiệm xen lẫn lớp trẻ đầy năng lượng, cùng công nghệ sân khấu hiện đại được ứng dụng khéo léo để giữ nguyên tinh thần cổ điển mà vẫn hấp dẫn người xem đương đại."
            },
            {
                type: "quote",
                text: "Âm vang người lính là dự án chúng tôi dành rất nhiều tâm huyết. Ở đây không chỉ có sự tái hiện quá khứ, mà là cách để sân khấu hôm nay đối thoại với lịch sử. Mỗi vở diễn đều hướng đến một thông điệp chung: người lính không chỉ là hình tượng của một thời, mà là biểu tượng của lòng trung thực, dũng cảm và niềm tin vào con người. Chúng tôi mong rằng, khi khán giả rời ghế xem, điều họ mang theo không chỉ là xúc động, mà là niềm tự hào rằng sân khấu Việt vẫn có thể cất lên những tiếng nói lớn lao và đầy nhân văn.",
                author: "NSƯT Kiều Minh Hiếu - Giám đốc Nhà hát Kịch Việt Nam"
            }
        ],

        // Tags
        tags: ["#ÂmVangNgườiLính", "#NhàHátKịchViệtNam", "#ĐêmTrắng", "#BiệtĐộiBáoĐen", "#BãoTốTrườngSơn"],

        // Thông tin liên hệ
        contact: {
            theater: "NHÀ HÁT KỊCH VIỆT NAM",
            address: "Số 01 Tràng Tiền, Cửa Nam, Hà Nội",
            contacts: [
                { role: "Phụ trách truyền thông", name: "Minh Trí" },
                { role: "Phụ trách CSKH", name: "Lê Hoài Anh" }
            ],
            phone: "024.3933.3535 - 0889.67.67.67",
            zalo: "https://zalo.me/1543673456404778136",
            website: "https://nhahatkichvietnam.vn/",
            email: "nhahatkichvietnam.nhkvn@gmail.com"
        }
    },
    {
        id: 5,
        title: "TỰ HÀO NHÀ HÁT KỊCH VIỆT NAM CÓ ĐẠI DIỆN TRONG 95 ĐẢNG VIÊN TRẺ TIÊU BIỂU HỌC TẬP VÀ LÀM THEO LỜI BÁC NĂM 2025",
        slug: "tu-hao-nha-hat-kich-viet-nam-co-dai-dien-trong-95-dang-vien-tre-tieu-bieu-hoc-tap-va-lam-theo-loi-bac-nam-2025",

        // Thông tin cơ bản
        author: "NHK",
        authorInfo: "Phòng Truyền thông",
        date: "09 Tháng 10, 2025",
        dateISO: "2025-10-09",
        category: "Tin tức báo chí",
        categorySlug: "tin-tuc-bao-chi",

        // Ảnh đại diện - ĐÃ SỬA
        image: "/News/tuhao.jpg",
        imageCaption: "Lễ Tuyên dương 95 đảng viên trẻ tiêu biểu học tập và làm theo lời Bác năm 2025",

        // Mô tả ngắn
        excerpt: "Sáng ngày 08/10/2025, tại Hà Nội, Đoàn Thanh niên Chính phủ tổ chức lễ Tuyên dương 95 đảng viên trẻ tiêu biểu học tập và làm theo lời Bác năm 2025. Nhà hát Kịch Việt Nam tự hào có đồng chí Nguyễn Hồng Phúc được vinh danh.",

        // Gallery
        gallery: [],

        // Nội dung chi tiết
        content: [
            {
                type: "paragraph",
                text: "Sáng ngày 08/10/2025, tại Hà Nội, Đoàn Thanh niên Chính phủ tổ chức lễ Tuyên dương 95 đảng viên trẻ tiêu biểu học tập và làm theo lời Bác năm 2025. Đây là hoạt động quan trọng nằm trong chuỗi sự kiện chào mừng Đại hội Đảng bộ Chính phủ lần thứ I, nhiệm kỳ 2025–2030."
            },
            {
                type: "paragraph",
                text: "Chương trình có sự tham dự của lãnh đạo Đảng ủy Chính phủ, đại diện các cơ sở đảng trực thuộc và đông đảo đoàn viên, thanh niên ưu tú."
            },
            {
                type: "paragraph",
                text: "Tại buổi lễ, các cá nhân tiêu biểu đại diện cho 51 tổ chức Đảng trực thuộc đã được trao chứng nhận và vinh danh vì những đóng góp thiết thực trong công tác đảng, đoàn và phong trào thanh niên."
            },
            {
                type: "paragraph",
                text: "Trong số 95 gương mặt được tuyên dương, Nhà hát Kịch Việt Nam rất tự hào khi đồng chí Nguyễn Hồng Phúc – một đảng viên trẻ đầy nhiệt huyết của đơn vị – là một trong những gương tiêu biểu được ghi nhận. Với tinh thần 'tiên phong, gương mẫu', đồng chí Phúc đã góp phần lan tỏa những giá trị tích cực về học tập, rèn luyện và cống hiến tại Nhà hát."
            },
            {
                type: "paragraph",
                text: "Sự vinh danh này không chỉ là niềm tự hào cá nhân mà còn là động lực để Nhà hát tiếp tục phát huy tinh thần sáng tạo, trách nhiệm và đồng hành cùng thế hệ trẻ trong hoạt động nghệ thuật và cộng đồng."
            }
        ],

        // Tags
        tags: ["#ĐảngViênTrẻTiêuBiểu", "#NhàHátKịchViệtNam", "#HọcTậpLàmTheoLờiBác", "#NguyễnHồngPhúc"],

        // Thông tin liên hệ
        contact: {
            theater: "NHÀ HÁT KỊCH VIỆT NAM",
            address: "Số 01 Tràng Tiền, Cửa Nam, Hà Nội",
            contacts: [
                { role: "Phụ trách truyền thông", name: "Minh Trí" },
                { role: "Phụ trách CSKH", name: "Lê Hoài Anh" }
            ],
            phone: "024.3933.3535 - 0889.67.67.67",
            zalo: "https://zalo.me/1543673456404778136",
            website: "https://nhahatkichvietnam.vn/",
            email: "nhahatkichvietnam.nhkvn@gmail.com"
        }
    },
    {
        id: 6,
        title: "NHÀ HÁT KỊCH VIỆT NAM 'BỘI THU' GIẢI THƯỞNG TẠI SÂN CHƠI THỬ NGHIỆM",
        slug: "nha-hat-kich-viet-nam-boi-thu-giai-thuong-tai-san-choi-thu-nghiem",

        // Thông tin cơ bản
        author: "NHK",
        authorInfo: "Phòng Truyền thông",
        date: "02 Tháng 12, 2025",
        dateISO: "2025-12-02",
        category: "Tin tức báo chí",
        categorySlug: "tin-tuc-bao-chi",

        // Ảnh đại diện - ĐÃ SỬA
        image: "/News/vho.jpg",
        imageCaption: "Nhà hát Kịch Việt Nam “bội thu” giải thưởng tại sân chơi thử nghiệm",

        // Mô tả ngắn
        excerpt: "VHO - Tại Liên hoan quốc tế Sân khấu thử nghiệm lần thứ VI năm 2025, Nhà hát Kịch Việt Nam đã khẳng định vị thế khi vở 'Người đi dép cao su' đạt giải tác phẩm Xuất sắc, cùng 2 huy chương Vàng và 3 giải thành phần sáng tạo Xuất sắc.",

        // Gallery - ĐÃ SỬA
        gallery: [
            {
                src: "/News/vho1.jpg",
                caption: ""
            },
            {
                src: "/News/vho2.jpg",
                caption: ""
            },
            {
                src: "/News/vho3.jpg",
                caption: "Cục trưởng Cục Nghệ thuật biểu diễn, NSND Nguyễn Xuân Bắc chúc mừng thành tích của Nhà hát Kịch Việt Nam"
            },
            {
                src: "/News/vho4.jpg",
                caption: "NSƯT Trịnh Mai Nguyên (vai Đại tướng Võ Nguyên Giáp) và nghệ sĩ Nguyễn Minh Hải (vai Chủ tịch Hồ Chí Minh) đạt huy chương Vàng"
            },
            {
                src: "/News/vho5.jpg",
                caption: "Khán giả đến xem vở diễn 'Người đi dép cao su' của Nhà hát Kịch Việt Nam"
            }
        ],

        // Nội dung chi tiết
        content: [
            {
                type: "paragraph",
                text: "VHO - Tại Liên hoan quốc tế Sân khấu thử nghiệm lần thứ VI năm 2025, Nhà hát Kịch Việt Nam đã khẳng định vị thế khi vở “Người đi dép cao su” đạt giải tác phẩm Xuất sắc. Cùng với đó, Nhà hát còn “ẵm” thêm 2 huy chương Vàng hạng mục nghệ sĩ và 3 giải thành phần sáng tạo Xuất sắc (đạo diễn, biên đạo múa, thiết kế ánh sáng)."
            },
            {
                type: "paragraph",
                text: "Thành quả này là sự ghi nhận xứng đáng cho hành trình chuyển mình mạnh mẽ của Nhà hát, khi không ngừng sáng tạo và dấn thân vào những thử nghiệm táo bạo, nhằm góp phần thổi luồng sinh khí mới vào đời sống sân khấu Việt."
            },
            {
                type: "heading",
                text: "Đột phá từ kịch bản và cấu trúc",
                level: 3
            },
            {
                type: "paragraph",
                text: "Thử nghiệm trong nghệ thuật sân khấu là hành trình sáng tạo đa chiều, xuyên suốt các phương diện: biên kịch, đạo diễn, diễn xuất, thiết kế mỹ thuật, âm nhạc, ánh sáng, âm thanh và ứng dụng công nghệ. Trên ba trụ cột quyết định: biên kịch, đạo diễn và nghệ thuật biểu diễn, vở diễn Người đi dép cao su đã thể hiện sự đổi mới đầy thuyết phục, phá vỡ giới hạn cũ kỹ, được Hội đồng giám khảo cùng giới chuyên môn đánh giá cao."
            },
            {
                type: "paragraph",
                text: "Kịch bản Người đi dép cao su của nhà văn Algeria Kateb Yacine dày hơn 300 trang, với 1.800 câu thoại của hàng trăm nhân vật, nhưng đã được TS. NGƯT Lê Mạnh Hùng biên tập, cô đọng để diễn trong hơn 60 phút. Đây vừa là thử thách, vừa là cơ hội sáng tạo, khi vở lướt qua lịch sử Việt Nam với những nhân vật anh hùng như Hai Bà Trưng, Triệu Trinh Nương, Đinh Bộ Lĩnh,… tập trung vào Hồ Chí Minh thời trẻ và sau này, cùng hình ảnh Đại tướng Võ Nguyên Giáp."
            },
            {
                type: "image",
                src: "/News/vho1.jpg",
                caption: ""
            },
            {
                type: "image",
                src: "/News/vho2.jpg",
                caption: ""
            },
            {
                type: "paragraph",
                text: "Điểm đột phá nằm ở kết cấu phi truyền thống: thay vì chia ba phần hay năm giai đoạn, hay theo lối “thắt nút – mở nút” rõ ràng, vở Người đi dép cao su xóa nhòa trình tự thời gian, sắp đặt nhân vật và đoạn dựng linh hoạt, tạo trải nghiệm sân khấu khác lạ. Kịch bản đề cập lịch sử nhưng không phải kịch lịch sử, nhắc tới chính trị nhưng không biến thành kịch chính luận. Hư cấu và sáng tạo được cân nhắc kỹ lưỡng, luôn gắn với hiện thực, đậm tính ước lệ nhưng vẫn giữ giá trị nhân văn sâu sắc."
            },
            {
                type: "quote",
                text: "Với Nhà hát Kịch Việt Nam, điểm sáng lớn nhất là cách họ làm mới cấu trúc kịch bản: kịch bản dài được rút gọn hợp lý, tiết tấu nhanh hơn, đồng thời đạo diễn lựa chọn ngôn ngữ dàn dựng tinh gọn, trực diện, tạo nhịp diễn cuốn hút.",
                author: "PGS.TS Nguyễn Thị Minh Thái"
            },
            {
                type: "image",
                src: "/News/vho3.jpg",
                caption: "Cục trưởng Cục Nghệ thuật biểu diễn, NSND Nguyễn Xuân Bắc chúc mừng thành tích của Nhà hát Kịch Việt Nam"
            },
            {
                type: "heading",
                text: "Sân khấu tối giản, hiệu quả tối đa",
                level: 3
            },
            {
                type: "paragraph",
                text: "Về dàn dựng, sân khấu được thiết kế tối giản đến mức tối đa, gần như trống rỗng, chỉ giữ 3 đạo cụ mang tính biểu tượng: chiếc áo tơi, một cây chông và hình tượng Bác Hồ tưới cây vú sữa. Không cần dựa vào cảnh trí hoành tráng hay kỹ xảo công nghệ, vở diễn vẫn truyền tải được sức nặng biểu cảm và thông điệp sâu sắc."
            },
            {
                type: "paragraph",
                text: "Lối dàn dựng này kết hợp với ánh sáng, âm nhạc và bố trí không gian linh hoạt, đã giúp Nhà hát giành 3 giải thành phần sáng tạo gồm: đạo diễn, biên đạo múa và thiết kế ánh sáng."
            },
            {
                type: "quote",
                text: "Sự tối giản này là chủ đích sáng tạo, tập trung mọi ánh nhìn vào diễn xuất và ngôn ngữ cơ thể, đúng tinh thần thử nghiệm.",
                author: "NSƯT Kiều Minh Hiếu - Giám đốc Nhà hát Kịch Việt Nam"
            },
            {
                type: "image",
                src: "/News/vho4.jpg",
                caption: "NSƯT Trịnh Mai Nguyên (vai Đại tướng Võ Nguyên Giáp) và nghệ sĩ Nguyễn Minh Hải (vai Chủ tịch Hồ Chí Minh) đạt huy chương Vàng ở hạng mục cá nhân"
            },
            {
                type: "heading",
                text: "Diễn xuất - 'Bộ máy sống' của vở diễn",
                level: 3
            },
            {
                type: "paragraph",
                text: "Về diễn xuất, dàn diễn viên trở thành “bộ máy sống” vận hành toàn bộ vở diễn. Trên sân khấu tối giản gần như trống không, họ không chỉ nhập vai mà còn gánh cả nhịp chuyển cảnh, tạo dựng không gian và dẫn dắt mạch thời gian bằng chính cơ thể mình. Từng bước chân, nhịp xoay, cú đưa tay hay thay đổi tiết tấu hơi thở đều mang chức năng kể chuyện, khiến diễn viên không còn là người trình diễn mà trở thành cấu trúc của vở kịch."
            },
            {
                type: "quote",
                text: "Người đi dép cao su là vở diễn tâm huyết của Nhà hát, mỗi diễn viên phải hóa thân vào nhiều nhân vật, câu chuyện trải dài hàng nghìn năm lịch sử, đòi hỏi sự phối hợp tuyệt đối và sức bền lớn. Và trong một cấu trúc dày đặc và xuyên suốt như thế, gần như không thể nói ai nổi trội hơn ai, bởi thành công của vở được tạo nên từ nỗ lực đồng bộ của cả tập thể nghệ sĩ.",
                author: "NSƯT Trịnh Mai Nguyên"
            },
            {
                type: "image",
                src: "/News/vho5.jpg",
                caption: "Khán giả đến xem vở diễn 'Người đi dép cao su' của Nhà hát Kịch Việt Nam"
            },
            {
                type: "heading",
                text: "Thử nghiệm thành công qua cảm nhận khán giả",
                level: 3
            },
            {
                type: "paragraph",
                text: "Trong nghệ thuật thử nghiệm, hiệu quả không chỉ được đo bằng những nhận định học thuật mà còn bằng “độ vang” trong lòng khán giả. Một tác phẩm có thể tinh xảo về kỹ thuật, sáng tạo trong cấu trúc, nhưng nếu không chạm tới cảm xúc người xem thì mọi tìm tòi chỉ dừng lại ở mức… lý thuyết. Sân khấu chỉ thực sự sống khi khán giả còn muốn ngồi lại, lắng nghe và cảm thụ."
            },
            {
                type: "paragraph",
                text: "Người đi dép cao su là minh chứng rõ ràng nhất cho điều đó. Suốt hơn 60 phút, vở giữ được nhịp kịch căng, không để cảm xúc rơi vào khoảng trống. Nhân vật xuất hiện xuyên suốt, hành động liền mạch, tạo nên một cấu trúc chặt chẽ khiến khán giả không có thời gian “thoát” khỏi câu chuyện. Khán phòng chật kín, phần lớn là học sinh, đây là nhóm đối tượng khó chiều bậc nhất ở sân khấu đương đại. Thế nhưng, các em vẫn ngồi lại từ đầu đến cuối, tập trung theo từng chuyển động của diễn viên. Sự im lặng theo dõi, những tràng vỗ tay vang lên đúng nhịp, mới là thước đo chân thật nhất cho tính hiệu quả của thử nghiệm của vở Người đi dép cao su."
            }
        ],

        // Tags
        tags: ["#NhàHátKịchViệtNam", "#NgườiĐiDépCaoSu", "#SânKhấuThửNghiệm", "#GiảiThưởng", "#HuyChươngVàng"],

        // Thông tin liên hệ
        contact: {
            theater: "NHÀ HÁT KỊCH VIỆT NAM",
            address: "Số 01 Tràng Tiền, Cửa Nam, Hà Nội",
            contacts: [
                { role: "Phụ trách truyền thông", name: "Minh Trí" },
                { role: "Phụ trách CSKH", name: "Lê Hoài Anh" }
            ],
            phone: "024.3933.3535 - 0889.67.67.67",
            zalo: "https://zalo.me/1543673456404778136",
            website: "https://nhahatkichvietnam.vn/",
            email: "nhahatkichvietnam.nhkvn@gmail.com"
        }
    }
];

export default newsData;