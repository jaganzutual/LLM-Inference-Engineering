import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackPath } from '../data/tracks.js';
import { useProgress } from '../lib/progress.jsx';
import Brand from './Brand.jsx';
import GithubLink from './GithubLink.jsx';
import ProgressRing from './ProgressRing.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import TrackSwitcher from './TrackSwitcher.jsx';
import {
  MenuIcon,
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
  const { trackStats } = useProgress();
  const stats = trackStats[track.id];
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
          className="icon-button menu-button"
          onClick={onOpenNav}
          aria-label={
            navOpen
              ? 'Close curriculum navigation'
              : 'Open curriculum navigation'
          }
          aria-controls="curriculum-nav"
          aria-expanded={navOpen}
        >
          <MenuIcon size={19} />
        </button>

        <Brand onClick={onNavigate} />

        <TrackSwitcher currentTrackId={track.id} />

        <div className="header-spacer" />

        <button
          type="button"
          className="search-trigger"
          onClick={onOpenSearch}
          aria-label="Search the curriculum"
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+K Meta+K"
        >
          <SearchIcon size={16} />
          <span>Search topics</span>
          <kbd>{shortcut}</kbd>
        </button>

        <Link
          className="header-progress"
          to={trackPath(track.id)}
          onClick={onNavigate}
          aria-label={`${stats.percent}% of ${track.title} complete. Open the track overview.`}
          title={`${stats.done} of ${stats.total} topics complete`}
        >
          <ProgressRing value={stats.percent} />
          <span>
            {stats.done}
            <em>/{stats.total}</em>
          </span>
        </Link>

        <GithubLink className="site-github" />

        <ThemeToggle />
      </div>
    </header>
  );
}
