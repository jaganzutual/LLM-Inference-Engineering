import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { trackPath, tracks } from '../data/tracks.js';
import { cx } from '../lib/utils.js';

export default function TrackSwitcher({ currentTrackId }) {
  const navRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    activeRef.current?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
    });
  }, [currentTrackId]);

  return (
    <nav
      ref={navRef}
      className="track-switcher"
      aria-label="Switch track"
    >
      {tracks.map((track) => {
        const active = track.id === currentTrackId;

        return (
          <Link
            key={track.id}
            ref={active ? activeRef : undefined}
            to={trackPath(track.id)}
            className={cx('track-switch-tab', active && 'is-active')}
            aria-current={active ? 'page' : undefined}
            title={track.title}
          >
            {track.shortTitle}
          </Link>
        );
      })}
    </nav>
  );
}
