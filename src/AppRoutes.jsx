import { Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PhasePage from './pages/PhasePage.jsx';
import TopicPage from './pages/TopicPage.jsx';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="phase/:phaseId" element={<PhasePage />} />
          <Route path="topic/:topicNumber" element={<TopicPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
