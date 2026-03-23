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
import Feedback from "../pages/feedback/Feedback";
import Task from "../pages/about/Task";
import Infrastructure from "../pages/about/Infrastructure";
import OrganisationStructure from "../pages/about/OrganisationStructure";
import BookingPage from "../pages/booking/BookingPage"; // THÊM IMPORT
import CheckoutPage from "../pages/checkout/CheckoutPage"; // THÊM IMPORT
function MainLayout({ children }) {
  return (
  <>
    <Header />
    <Navbar />
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
    <Route path="/tin-tuc/:slug" element={<NewsDetail />} /> 
    <Route path="/vo-dien" element={<Performances />} />
    <Route path="/gop-y" element={<Feedback />} />
   </Routes>
  </main>
   <Footer />
   </>
  );
}

export default MainLayout;