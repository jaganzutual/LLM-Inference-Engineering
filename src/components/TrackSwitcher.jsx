import { Link } from 'react-router-dom';
import { trackPath, tracks } from '../data/tracks.js';
import { cx } from '../lib/utils.js';

export default function TrackSwitcher({ currentTrackId }) {
  return (
    <nav className="track-switcher" aria-label="Switch track">
      {tracks.map((track) => {
        const active = track.id === currentTrackId;

        return (
          <Link
            key={track.id}
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
