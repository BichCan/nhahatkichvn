import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import NewsManagement from './adminpages/news/NewsManagement';
import ArtistManagement from './adminpages/artists/ArtistManagement';
import PaymentManagement from './adminpages/payments/PaymentManagement';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Admin Section */}
        {/* Admin Section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="news" element={<NewsManagement />} />
          <Route path="artists" element={<ArtistManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
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