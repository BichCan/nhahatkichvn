import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaMapLocationDot, FaPhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-white"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%),
          linear-gradient(225deg, rgba(255,255,255,0.03) 25%, transparent 25%),
          linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
          linear-gradient(315deg, rgba(255,255,255,0.03) 25%, transparent 25%)
        `,
        backgroundPosition: '100px 0, 100px 0, 0 0, 0 0',
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute w-32 h-32 border border-white/10 rotate-45 -top-10 -left-10"></div>
      <div className="absolute w-48 h-48 border border-white/10 rotate-45 top-1/2 -right-20"></div>
      <div className="absolute w-24 h-24 border border-white/10 rotate-45 bottom-10 left-1/4 opacity-50"></div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-row max-[768px]:flex-col max-[768px]:gap-4 gap-12">
          
          {/* Branding Section */}
          <div className="flex-1">
            <h2 className="text-white font-bold font-[Playfair_Display] text-2xl uppercase tracking-wider">
              NHÀ HÁT KỊCH VIỆT NAM
            </h2>
            <div className="w-10 h-[3px] bg-rose-600 my-2 mb-5"></div>
            <p className="text-gray-400 text-sm leading-relaxed italic">
              Nơi sản sinh ra những vở kịch cảm xúc và lắng đọng nhất cho người xem
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex-1">
            <h3 className="text-white font-bold font-[Playfair_Display] text-xl uppercase tracking-wide">
              LIÊN HỆ
            </h3>
            <div className="w-10 h-[3px] bg-rose-600 my-2 mb-5"></div>
            
            <div className="space-y-4 text-sm text-gray-300">
              {/* Address */}
              <div className="flex items-start gap-3">
                <FaMapLocationDot className="text-rose-600 mt-1 min-w-10 h-5" />
                <span>Số 1 Tràng Tiền, Cửa Nam, Hanoi, Vietnam</span>
              </div>
              
              {/* Phone */}
              <div className="flex items-center gap-3">
                <FaPhone className="text-rose-600 min-w-10 h-5" />
                <a href="tel:02439333535" className="hover:text-white transition-colors">
                  024 3933 3535
                </a>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-3">
                <IoMail className="text-rose-600 min-w-10 h-5" />
                <a href="mailto:nhahatkichvietnam.nhkvn@gmail.com" className="hover:text-white transition-colors truncate">
                  nhahatkichvietnam.nhkvn@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="flex-1">
            <h3 className="text-white font-bold font-[Playfair_Display] text-xl uppercase tracking-wide">
              THEO DÕI CHÚNG TÔI
            </h3>
            <div className="w-10 h-[3px] bg-rose-600 my-2 mb-5"></div>
            
            <p className="text-gray-400 text-xs mb-4 uppercase tracking-tighter">
              Follow us
            </p>
            
            <div className="flex py-2 gap-4 text-gray-400">
              <a 
                href="#" 
                aria-label="Facebook"
                className="hover:text-rose-600 transition-colors"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
                className="hover:text-rose-600 transition-colors"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                aria-label="YouTube"
                className="hover:text-rose-600 transition-colors"
              >
                <FaYoutube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            © 2023 Nhà Hát Kịch Việt Nam. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}