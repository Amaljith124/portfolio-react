import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DefaultPortfolio, MagicPortfolio, UserPortfolio } from './components/PortfolioShell';

// the admin area is a separate chunk: visitors of the portfolio never download it
const AdminApp = lazy(() => import('./pages/Admin/AdminApp'));

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      <Route path="/portfolio/:token/*" element={<MagicPortfolio />} />
      <Route path="/p/:slug/*" element={<UserPortfolio />} />
      <Route path="/*" element={<DefaultPortfolio />} />
    </Routes>
  );
}
