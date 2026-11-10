import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Brand from './Brand.jsx';
import SearchDialog from './SearchDialog.jsx';
import Sidebar from './Sidebar.jsx';
import SiteHeader from './SiteHeader.jsx';

export default function AppShell() {
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
      <a
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById('main-content');
          main?.focus();
          main?.scrollIntoView({ block: 'start' });
        }}
      >
        Skip to content
      </a>

      <SiteHeader
        navOpen={navOpen}
        onOpenNav={() => setNavOpen((current) => !current)}
        onOpenSearch={() => setSearchOpen(true)}
        menuButtonRef={menuButtonRef}
        onNavigate={closeNavOnNavigate}
      />

      <div className="app-body">
        <Sidebar
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

      <footer className="site-footer">
        <div className="footer-inner">
          <Brand />
          <p>A structured path through LLM inference engineering.</p>
          <a
            href="https://github.com/jaganzutual/LLM-Inference-Engineering"
            target="_blank"
            rel="noreferrer"
          >
            Built in public on GitHub
          </a>
        </div>
      </footer>

      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
