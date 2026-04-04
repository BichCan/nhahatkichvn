import Header from "./header/Header";
import Footer from "./footer/Footer";
import Navbar from "./navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import History from "../pages/about/History";
import Artists from "../pages/artists/Artists";
import ArtistDetail from "../pages/artists/ArtistDetail";
import Booking from "../pages/booking/Booking";
import News from "../pages/news/News";
import NewsDetail from "../pages/news/NewsDetail"; // THÊM IMPORT
import Performances from "../pages/performances/Performances";
import TicketInfo from "../pages/booking/TicketInfo"; // <-- mới
import Feedback from "../pages/feedback/Feedback";
import Task from "../pages/about/Task";
import Infrastructure from "../pages/about/Infrastructure";
import OrganisationStructure from "../pages/about/OrganisationStructure";
import BookingPage from "../pages/booking/BookingPage"; // THÊM IMPORT
import CheckoutPage from "../pages/checkout/CheckoutPage"; // THÊM IMPORT
import LoginPage from "../pages/login/LoginPage"; // THÊM IMPORT
import { useLocation } from "react-router-dom"; // THÊM IMPORT

function MainLayout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      {!isLoginPage && <Navbar />}
      <main className="min-w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gioi-thieu/lich-su" element={<History />} />
          <Route path="/gioi-thieu/chuc-nang" element={<Task />} />
          <Route path="/gioi-thieu/co-so-vat-chat" element={<Infrastructure />} />
          <Route path="/gioi-thieu/to-chuc" element={<OrganisationStructure />} />
          <Route path="/nghe-si" element={<Artists />} />
          <Route path="/nghe-si/:artistId" element={<ArtistDetail />} />
          <Route path="/dat-ve" element={<Booking />} />
          <Route path="/dat-ve/:performanceId" element={<BookingPage />} /> 
          <Route path="/thanh-toan/:performanceId" element={<CheckoutPage />} />
          <Route path="/tin-tuc" element={<News />} />
          <Route path="/tin-tuc/:id" element={<NewsDetail />} /> 
          <Route path="/vo-dien" element={<Performances />} />
          <Route path="/thong-tin-dat-ve" element={<TicketInfo />} />
          <Route path="/gop-y" element={<Feedback />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
}

export default MainLayout;