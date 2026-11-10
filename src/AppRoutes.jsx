import {
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import { topicByNumber } from './data/curriculum.js';
import {
  trackById,
  trackForTopic,
  trackPath,
  trackTopicPath,
} from './data/tracks.js';
import PublicLayout from './components/PublicLayout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import TrackShell from './components/TrackShell.jsx';
import HeroPage from './pages/HeroPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import TopicPage from './pages/TopicPage.jsx';
import TrackPage from './pages/TrackPage.jsx';
import TracksPage from './pages/TracksPage.jsx';

function LegacyPhaseRedirect() {
  const { phaseId } = useParams();
  const track = trackById(phaseId);
  return (
    <Navigate
      to={track ? trackPath(track.id) : '/tracks'}
      replace
    />
  );
}

function LegacyTopicRedirect() {
  const { topicNumber } = useParams();
  const topic = topicByNumber(topicNumber);
  const track = topic ? trackForTopic(topic.number) : null;
  return (
    <Navigate
      to={track ? trackTopicPath(track.id, topic.number) : '/tracks'}
      replace
    />
  );
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <HeroPage />
            </PublicLayout>
          }
        />
        <Route
          path="/tracks"
          element={
            <PublicLayout>
              <TracksPage />
            </PublicLayout>
          }
        />
        <Route path="/track/:trackId" element={<TrackShell />}>
          <Route index element={<TrackPage />} />
          <Route path="topic/:topicNumber" element={<TopicPage />} />
        </Route>
        <Route path="/phase/:phaseId" element={<LegacyPhaseRedirect />} />
        <Route path="/topic/:topicNumber" element={<LegacyTopicRedirect />} />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
}
