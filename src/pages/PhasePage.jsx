import { Link, useParams } from 'react-router-dom';
import {
  phaseById,
  phasePath,
  phases,
  topicPath,
} from '../data/curriculum.js';
import { useProgress } from '../lib/progress.jsx';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import TopicRow from '../components/TopicRow.jsx';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from '../components/Icons.jsx';
import { pad } from '../lib/utils.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function PhasePage() {
  const { phaseId } = useParams();
  const phase = phaseById(phaseId);

  if (!phase) return <NotFoundPage />;
  return <PhaseDetail phase={phase} />;
}

function PhaseDetail({ phase }) {
  useDocumentTitle(`${phase.title} — Inference Engineering`);

  const { phaseStats, nextTopicInPhase } = useProgress();
  const stats = phaseStats[phase.id];
  const complete = stats.done === stats.total;
  const startTopic = nextTopicInPhase(phase);
  const previousPhase = phases.find((item) => item.id === phase.id - 1);
  const nextPhase = phases.find((item) => item.id === phase.id + 1);

  return (
    <div className="page phase-page">
      <Breadcrumbs
        items={[
          { label: 'Curriculum', to: '/' },
          { label: `Phase ${pad(phase.id, 2)}` },
        ]}
      />

      <section className="phase-hero">
        <div className="phase-hero-copy">
          <p className="eyebrow">
            Phase {pad(phase.id, 2)}
            <span className="tag">{phase.tag}</span>
          </p>
          <h1>{phase.title}</h1>
          <p className="lead">{phase.description}</p>
        </div>

        <div className="phase-hero-progress">
          <div className="phase-hero-count">
            <strong>{stats.done}</strong>
            <span>/ {stats.total} complete</span>
          </div>
          <ProgressBar
            value={stats.done}
            max={stats.total}
            label={`${phase.title} progress`}
          />
          <Link
            className="btn btn-primary"
            to={topicPath(startTopic.number)}
          >
            {complete ? 'Review phase' : stats.done > 0 ? 'Continue phase' : 'Start phase'}
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>

      <section className="phase-topics" aria-labelledby="phase-topics-title">
        <div className="section-heading compact">
          <div>
            <h2 id="phase-topics-title">Topics</h2>
          </div>
          <p>
            {stats.total} topics · {stats.done} complete
          </p>
        </div>

        <div className="topic-list-card">
          {phase.topics.map((topic) => (
            <TopicRow key={topic.number} topic={topic} />
          ))}
        </div>
      </section>

      <nav className="phase-pager" aria-label="Phase navigation">
        {previousPhase ? (
          <Link className="pager-card prev" to={phasePath(previousPhase.id)}>
            <span>
              <ArrowLeftIcon size={14} /> Previous phase
            </span>
            <strong>{previousPhase.title}</strong>
          </Link>
        ) : (
          <span className="pager-spacer" aria-hidden="true" />
        )}

        {nextPhase ? (
          <Link className="pager-card next" to={phasePath(nextPhase.id)}>
            <span>
              Next phase <ArrowRightIcon size={14} />
            </span>
            <strong>{nextPhase.title}</strong>
          </Link>
        ) : (
          <span className="pager-spacer" aria-hidden="true" />
        )}
      </nav>
    </div>
  );
}
