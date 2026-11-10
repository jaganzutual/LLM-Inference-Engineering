import { useEffect, useRef } from 'react';
import { Link, useMatch } from 'react-router-dom';
import {
  trackPath,
  tracks,
} from '../data/tracks.js';
import { useProgress } from '../lib/progress.jsx';
import { cx, pad } from '../lib/utils.js';
import ProgressBar from './ProgressBar.jsx';
import {
  CheckIcon,
  ListIcon,
  XIcon,
} from './Icons.jsx';

export default function Sidebar({ track, open, onClose, onNavigate }) {
  const topicMatch = useMatch('/track/:trackId/topic/:topicNumber');
  const { trackStats, isComplete } = useProgress();
  const stats = trackStats[track.id];
  const activeTopicNumber = topicMatch
    ? Number(topicMatch.params.topicNumber)
    : null;

  const closeButtonRef = useRef(null);
  const activeTopicRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    activeTopicRef.current?.scrollIntoView({ block: 'center' });
  }, [activeTopicNumber, open]);

  return (
    <aside
      id="curriculum-nav"
      className={cx('sidebar', open && 'is-open')}
      aria-label="Track navigation"
    >
      <div className="sidebar-head">
        <div className="sidebar-head-row">
          <span className="sidebar-label">Track {pad(track.id, 2)}</span>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close track navigation"
          >
            <XIcon size={18} />
          </button>
        </div>

        <Link
          className="sidebar-track-title"
          to={trackPath(track.id)}
          onClick={onNavigate}
        >
          {track.title}
        </Link>

        <div className="sidebar-progress">
          <div>
            <strong>{stats.done}</strong>
            <span> / {stats.total} complete</span>
          </div>
          <span>{stats.percent}%</span>
        </div>
        <ProgressBar
          value={stats.done}
          max={stats.total}
          size="sm"
          label={`${track.title} progress`}
        />
      </div>

      <nav className="sidebar-nav" aria-label="Track contents">
        <Link to="/tracks" className="sidebar-overview" onClick={onNavigate}>
          <ListIcon size={15} />
          All tracks
        </Link>

        <div className="sidebar-switcher">
          <div className="sidebar-section-label">Switch track</div>
          {tracks.map((item) => {
            const itemStats = trackStats[item.id];
            return (
              <Link
                key={item.id}
                to={trackPath(item.id)}
                className={cx(
                  'sidebar-switch',
                  item.id === track.id && 'is-active',
                )}
                onClick={onNavigate}
              >
                <span className="sidebar-switch-number">
                  {pad(item.id, 2)}
                </span>
                <span className="sidebar-switch-title">
                  {item.shortTitle}
                </span>
                <span className="sidebar-switch-count">
                  {itemStats.done}/{itemStats.total}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="sidebar-section-head">
          <span>Topics</span>
          <span>{stats.total}</span>
        </div>

        <ul className="sidebar-topics">
          {track.topics.map((topic) => {
            const active = activeTopicNumber === topic.number;
            const done = isComplete(topic.number);

            return (
              <li key={topic.number}>
                <Link
                  ref={active ? activeTopicRef : undefined}
                  to={`${trackPath(track.id)}/topic/${topic.number}`}
                  className={cx(
                    'sidebar-topic',
                    active && 'is-active',
                  )}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="sidebar-topic-number">
                    {pad(topic.number)}
                  </span>
                  <span className="sidebar-topic-title">
                    {topic.title}
                  </span>
                  {done && (
                    <CheckIcon
                      size={12}
                      className="sidebar-topic-check"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-foot">
        <span>{tracks.length} tracks</span>
        <span>{stats.done}/{stats.total} done</span>
      </div>
    </aside>
  );
}
