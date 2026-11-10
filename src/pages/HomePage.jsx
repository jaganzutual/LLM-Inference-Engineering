import { Link } from 'react-router-dom';
import { allTopics, phases, totalTopics } from '../data/curriculum.js';
import { useProgress } from '../lib/progress.jsx';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import PhaseCard from '../components/PhaseCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  PlayIcon,
} from '../components/Icons.jsx';
import { pad } from '../lib/utils.js';

export default function HomePage() {
  useDocumentTitle('Inference Engineering — Learn how LLMs actually run');

  const { completedCount, percent, phaseStats, nextTopic } = useProgress();
  const allComplete = completedCount === totalTopics;
  const destination = allComplete ? allTopics[0] : nextTopic;
  const ctaLabel = allComplete
    ? 'Review the path'
    : completedCount > 0
      ? 'Continue learning'
      : 'Start the path';

  return (
    <div className="page home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> A structured learning path
          </p>
          <h1>Learn how LLMs actually run.</h1>
          <p className="lead">
            Ten phases and 180 topics, from tensors and GPUs to production
            inference and kernel engineering.
          </p>

          <div className="hero-actions">
            <Link
              className="btn btn-primary"
              to={`/topic/${destination.number}`}
            >
              {ctaLabel}
              <ArrowRightIcon size={16} />
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                document
                  .getElementById('curriculum')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              Browse curriculum
            </button>
          </div>

          <div className="hero-flow" aria-label="How the path works">
            <span>
              <BookOpenIcon size={14} /> Read the notes
            </span>
            <i aria-hidden="true">→</i>
            <span>
              <PlayIcon size={14} /> Watch the walkthrough
            </span>
            <i aria-hidden="true">→</i>
            <span>
              <CheckIcon size={14} /> Track progress
            </span>
          </div>
        </div>

        <aside className="progress-panel" aria-label="Your progress">
          <div className="progress-panel-head">
            <span>Your progress</span>
            <span className="mono">{percent}%</span>
          </div>

          <div className="progress-panel-value">
            <strong>{completedCount}</strong>
            <span>/ {totalTopics} topics</span>
          </div>

          <ProgressBar
            value={completedCount}
            max={totalTopics}
            label="Overall curriculum progress"
          />

          {allComplete ? (
            <p className="progress-panel-done">
              You have completed every topic in the path. Revisit any phase to
              keep it fresh.
            </p>
          ) : (
            <div className="progress-panel-next">
              <span className="eyebrow">Next up</span>
              <Link to={`/topic/${nextTopic.number}`}>
                <span className="mono">{pad(nextTopic.number)}</span>
                {nextTopic.title}
              </Link>
            </div>
          )}

          <p className="progress-panel-note">
            Progress is saved automatically in this browser.
          </p>
        </aside>
      </section>

      <section className="section" id="curriculum">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The curriculum</p>
            <h2>Ten phases, in order</h2>
          </div>
          <p>
            Start at the foundations or jump to the phase you need. Each topic
            builds on the one before it.
          </p>
        </div>

        <div className="phase-grid">
          {phases.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              stats={phaseStats[phase.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
