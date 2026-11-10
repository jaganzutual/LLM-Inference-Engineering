import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { totalTopics } from '../data/curriculum.js';
import { useProgress } from '../lib/progress.jsx';
import Brand from './Brand.jsx';
import ProgressRing from './ProgressRing.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import {
  GithubIcon,
  MenuIcon,
  SearchIcon,
} from './Icons.jsx';

export default function SiteHeader({
  navOpen,
  onOpenNav,
  onOpenSearch,
  menuButtonRef,
  onNavigate,
}) {
  const { completedCount, percent } = useProgress();
  const [shortcut, setShortcut] = useState('Ctrl K');

  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent;
    if (/Mac|iPhone|iPad/i.test(platform)) setShortcut('⌘K');
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button
          ref={menuButtonRef}
          type="button"
          className="icon-button menu-button"
          onClick={onOpenNav}
          aria-label={navOpen ? 'Close curriculum navigation' : 'Open curriculum navigation'}
          aria-controls="curriculum-nav"
          aria-expanded={navOpen}
        >
          <MenuIcon size={19} />
        </button>

        <Brand onClick={onNavigate} />

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
          to="/"
          onClick={onNavigate}
          aria-label={`${percent}% of the curriculum complete. Open the overview.`}
          title={`${completedCount} of ${totalTopics} topics complete`}
        >
          <ProgressRing value={percent} />
          <span>
            {completedCount}
            <em>/{totalTopics}</em>
          </span>
        </Link>

        <a
          className="icon-button github-link"
          href="https://github.com/jaganzutual/LLM-Inference-Engineering"
          target="_blank"
          rel="noreferrer"
          aria-label="View the project on GitHub"
          title="View on GitHub"
        >
          <GithubIcon size={18} />
        </a>

        <ThemeToggle />
      </div>
    </header>
  );
}
