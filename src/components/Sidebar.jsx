import { useEffect, useRef } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { trackPath } from '../data/tracks.js';
import { useProgress } from '../lib/progress.jsx';
import { cx, pad } from '../lib/utils.js';
import {
  CheckIcon,
  ListIcon,
  XIcon,
} from './Icons.jsx';

export default function Sidebar({ track, open, onClose, onNavigate }) {
  const topicMatch = useMatch('/track/:trackId/topic/:topicNumber');
  const { isComplete } = useProgress();
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
      </div>

      <nav className="sidebar-nav" aria-label="Track contents">
        <Link to="/tracks" className="sidebar-overview" onClick={onNavigate}>
          <ListIcon size={15} />
          All tracks
        </Link>

        <div className="sidebar-section-head">
          <span>Topics</span>
          <span>{track.topics.length}</span>
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
    </aside>
  );
}
