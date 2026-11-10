import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { trackById } from '../data/tracks.js';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import PublicLayout from './PublicLayout.jsx';
import SearchDialog from './SearchDialog.jsx';
import Sidebar from './Sidebar.jsx';
import SiteFooter from './SiteFooter.jsx';
import SiteHeader from './SiteHeader.jsx';
import SkipLink from './SkipLink.jsx';

export default function TrackShell() {
  const { trackId } = useParams();
  const track = trackById(trackId);

  if (!track) {
    return (
      <PublicLayout>
        <NotFoundPage />
      </PublicLayout>
    );
  }

  return <TrackWorkspace track={track} />;
}

function TrackWorkspace({ track }) {
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef(null);

  useEffect(() => {
    setNavOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const inertTargets = [
      document.querySelector('.site-header'),
      document.getElementById('main-content'),
      document.querySelector('.site-footer'),
    ].filter(Boolean);
    inertTargets.forEach((element) => {
      element.inert = true;
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setNavOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      inertTargets.forEach((element) => {
        element.inert = false;
      });
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setNavOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const closeNav = useCallback(() => {
    setNavOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeNavOnNavigate = useCallback(() => {
    setNavOpen(false);
    requestAnimationFrame(() =>
      document.getElementById('main-content')?.focus(),
    );
  }, []);

  return (
    <div className="app">
      <SkipLink />

      <SiteHeader
        track={track}
        navOpen={navOpen}
        onOpenNav={() => setNavOpen((current) => !current)}
        onOpenSearch={() => setSearchOpen(true)}
        menuButtonRef={menuButtonRef}
        onNavigate={closeNavOnNavigate}
      />

      <div className="app-body">
        <Sidebar
          track={track}
          open={navOpen}
          onClose={closeNav}
          onNavigate={closeNavOnNavigate}
        />
        <div
          className={`nav-scrim${navOpen ? ' is-visible' : ''}`}
          onClick={closeNav}
          aria-hidden="true"
        />

        <main id="main-content" className="main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      <SiteFooter />

      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
