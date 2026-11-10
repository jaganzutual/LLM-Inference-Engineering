import { Link } from 'react-router-dom';
import { trackPath } from '../data/tracks.js';
import { pad } from '../lib/utils.js';
import {
  ArrowUpRightIcon,
  CheckIcon,
} from './Icons.jsx';

export default function TrackCard({ track }) {
  return (
    <Link
      className="track-card"
      to={trackPath(track.id)}
      aria-label={`Track ${track.id}: ${track.title}`}
    >
      <div className="track-card-top">
        <span className="track-card-index">Track {pad(track.id, 2)}</span>
        <span className="tag">{track.tag}</span>
      </div>

      <h3>{track.title}</h3>
      <p>{track.summary}</p>

      <ul className="track-card-outcomes">
        {track.outcomes.map((outcome) => (
          <li key={outcome}>
            <CheckIcon size={13} />
            <span>{outcome}</span>
          </li>
        ))}
      </ul>

      <div className="track-card-foot">
        <div className="track-card-meta">
          <span>{track.level}</span>
          <span>{track.topics.length} topics</span>
        </div>
        <span className="track-card-arrow" aria-hidden="true">
          <ArrowUpRightIcon size={15} />
        </span>
      </div>
    </Link>
  );
}
