import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  trackPath,
  trackTopicPath,
} from '../data/tracks.js';
import { cx, pad } from '../lib/utils.js';
import { ListIcon } from './Icons.jsx';

export default function TopicSidebar({ track, activeTopicNumber }) {
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center' });
  }, [activeTopicNumber]);

  return (
    <aside className="topic-sidebar" aria-label="Track topics">
      <div className="topic-sidebar-head">
        <span className="topic-sidebar-label">
          Track {pad(track.id, 2)}
        </span>
        <Link
          className="topic-sidebar-track"
          to={trackPath(track.id)}
        >
          {track.title}
        </Link>
      </div>

      <nav className="topic-sidebar-nav" aria-label="Track contents">
        <Link to="/tracks" className="topic-sidebar-all">
          <ListIcon size={15} />
          All tracks
        </Link>

        <div className="topic-sidebar-heading">
          <span>Topics</span>
          <span>{track.topics.length}</span>
        </div>

        <ul className="topic-sidebar-list">
          {track.topics.map((topic) => {
            const active = topic.number === activeTopicNumber;

            return (
              <li key={topic.number}>
                <Link
                  ref={active ? activeRef : undefined}
                  to={trackTopicPath(track.id, topic.number)}
                  className={cx(
                    'topic-sidebar-link',
                    active && 'is-active',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="topic-sidebar-number">
                    {pad(topic.number)}
                  </span>
                  <span className="topic-sidebar-title">
                    {topic.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
