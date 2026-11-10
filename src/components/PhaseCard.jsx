import { Link } from 'react-router-dom';
import { phasePath } from '../data/curriculum.js';
import { pad } from '../lib/utils.js';
import ProgressBar from './ProgressBar.jsx';
import { ArrowUpRightIcon } from './Icons.jsx';

export default function PhaseCard({ phase, stats }) {
  return (
    <Link
      className="phase-card"
      to={phasePath(phase.id)}
      aria-label={`Phase ${phase.id}: ${phase.title}`}
    >
      <div className="phase-card-top">
        <span className="phase-index">Phase {pad(phase.id, 2)}</span>
        <span className="tag">{phase.tag}</span>
      </div>

      <h3>{phase.title}</h3>
      <p>{phase.description}</p>

      <div className="phase-card-foot">
        <div className="phase-card-meta">
          <span>{stats.total} topics</span>
          {stats.done > 0 && <span>{stats.done} done</span>}
        </div>
        <span className="phase-card-arrow" aria-hidden="true">
          <ArrowUpRightIcon size={15} />
        </span>
      </div>

      <ProgressBar
        value={stats.done}
        max={stats.total}
        size="xs"
        label={`${phase.title} progress`}
      />
    </Link>
  );
}
