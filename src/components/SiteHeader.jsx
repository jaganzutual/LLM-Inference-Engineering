import { useEffect, useState } from 'react';
import Brand from './Brand.jsx';
import GithubLink from './GithubLink.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import TrackSwitcher from './TrackSwitcher.jsx';
import {
  ListIcon,
  SearchIcon,
} from './Icons.jsx';

export default function SiteHeader({
  track,
  navOpen,
  onOpenNav,
  onOpenSearch,
  menuButtonRef,
  onNavigate,
}) {
  const [shortcut, setShortcut] = useState('Ctrl K');

  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent;
    if (/Mac|iPhone|iPad/i.test(platform)) setShortcut('⌘K');
  }, []);

  return (
    <header className="site-header app-header">
      <div className="site-header-inner">
        <button
          ref={menuButtonRef}
          type="button"
          className="header-contents"
          onClick={onOpenNav}
          aria-label={
            navOpen ? 'Close track contents' : 'Open track contents'
          }
          aria-controls="curriculum-nav"
          aria-expanded={navOpen}
        >
          <ListIcon size={16} />
          <span>Contents</span>
        </button>

        <Brand onClick={onNavigate} />

        <div className="header-spacer" />

        <TrackSwitcher currentTrackId={track.id} />

        <button
          type="button"
          className="icon-button header-search"
          onClick={onOpenSearch}
          aria-label={`Search topics (${shortcut})`}
          title={`Search topics (${shortcut})`}
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+K Meta+K"
        >
          <SearchIcon size={17} />
        </button>

        <GithubLink className="site-github" />

        <ThemeToggle />
      </div>
    </header>
  );
}
