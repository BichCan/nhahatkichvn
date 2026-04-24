import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import NewsManagement from './adminpages/news/NewsManagement';
import ArtistManagement from './adminpages/artists/ArtistManagement';
import UpdateArtist from './adminpages/artists/UpdateArtist';
import UpdateNews from './adminpages/news/UpdateNews';
import CreateNews from './adminpages/news/CreateNews';
import PaymentManagement from './adminpages/payments/PaymentManagement';
import AddOrder from './adminpages/payments/AddOrder';
import UpdateOrder from './adminpages/payments/UpdateOrder';
import PerformanceManagement from './adminpages/performances/PerformanceManagement';
import AddPerformance from './adminpages/performances/AddPerformance';
import UpdatePerformance from './adminpages/performances/UpdatePerformance';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Admin Section */}
        {/* Admin Section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="news" element={<NewsManagement />} />
          <Route path="news/create" element={<CreateNews />} />
          <Route path="news/update/:id" element={<UpdateNews />} />
          <Route path="artists" element={<ArtistManagement />} />
          <Route path="artists/update/:id" element={<UpdateArtist />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="payments/add" element={<AddOrder />} />
          <Route path="payments/update/:id" element={<UpdateOrder />} />
          <Route path="performances" element={<PerformanceManagement />} />
          <Route path="performances/create" element={<AddPerformance />} />
          <Route path="performances/update/:id" element={<UpdatePerformance />} />
          <Route path="dashboard" element={<div className="p-8"><h1 className="text-2xl font-bold">Dashboard (Đang xây dựng)</h1></div>} />
          {/* Add more admin sub-routes here */}
        </Route>
        
        {/* Main Public Section */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </div>
  );
}

export default App;