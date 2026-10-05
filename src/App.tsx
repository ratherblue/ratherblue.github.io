import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import PortfolioPage from './pages/PortfolioPage/PortfolioPage';
import LegacyPage from './pages/LegacyPage/LegacyPage';
import DiyPage from './pages/DiyPage/DiyPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="legacy" element={<LegacyPage />} />
        <Route path="diy" element={<DiyPage />} />
      </Route>
    </Routes>
  );
}
