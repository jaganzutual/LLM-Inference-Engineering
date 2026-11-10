import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import {
  phaseForTopic,
  phasePath,
  phases,
  topicPath,
  totalTopics,
} from '../data/curriculum.js';
import { useProgress } from '../lib/progress.jsx';
import { cx, pad } from '../lib/utils.js';
import ProgressBar from './ProgressBar.jsx';
import {
  CheckIcon,
  ChevronDownIcon,
  ListIcon,
  XIcon,
} from './Icons.jsx';

export default function Sidebar({ open, onClose, onNavigate }) {
  const location = useLocation();
  const phaseMatch = useMatch('/phase/:phaseId');
  const topicMatch = useMatch('/topic/:topicNumber');
  const { completedCount, percent, phaseStats, isComplete } = useProgress();

  const activePhaseId = phaseMatch
    ? Number(phaseMatch.params.phaseId)
    : topicMatch
      ? (phaseForTopic(Number(topicMatch.params.topicNumber))?.id ?? null)
      : null;
  const activeTopicNumber = topicMatch
    ? Number(topicMatch.params.topicNumber)
    : null;
  const onHome = location.pathname === '/';

  const [expanded, setExpanded] = useState(
    () => new Set(activePhaseId ? [activePhaseId] : []),
  );
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!activePhaseId) return;
    setExpanded((current) => {
      if (current.has(activePhaseId)) return current;
      const next = new Set(current);
      next.add(activePhaseId);
      return next;
    });
  }, [activePhaseId]);

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() =>
      closeButtonRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const togglePhase = (phaseId) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  return (
    <aside
      id="curriculum-nav"
      className={cx('sidebar', open && 'is-open')}
      aria-label="Curriculum navigation"
    >
      <div className="sidebar-head">
        <div className="sidebar-head-row">
          <span className="sidebar-label">Curriculum</span>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close curriculum navigation"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="sidebar-progress">
          <div>
            <strong>{completedCount}</strong>
            <span> / {totalTopics} complete</span>
          </div>
          <span>{percent}%</span>
        </div>
        <ProgressBar
          value={completedCount}
          max={totalTopics}
          size="sm"
          label="Overall curriculum progress"
        />
      </div>

      <nav className="sidebar-nav" aria-label="Learning path">
        <Link
          to="/"
          className={cx('sidebar-overview', onHome && 'is-active')}
          onClick={onNavigate}
        >
          <ListIcon size={15} />
          Overview
        </Link>

        <div className="sidebar-phases">
          {phases.map((phase) => {
            const stats = phaseStats[phase.id];
            const isActive = activePhaseId === phase.id;
            const isExpanded = expanded.has(phase.id);

            return (
              <div
                key={phase.id}
                className={cx('sidebar-phase', isActive && 'is-active')}
              >
                <div className="sidebar-phase-row">
                  <Link
                    to={phasePath(phase.id)}
                    className="sidebar-phase-link"
                    onClick={onNavigate}
                  >
                    <span className="sidebar-phase-number">
                      {pad(phase.id, 2)}
                    </span>
                    <span className="sidebar-phase-copy">
                      <span>{phase.title}</span>
                      <small>
                        {stats.done}/{stats.total} complete
                      </small>
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="sidebar-expand"
                    onClick={() => togglePhase(phase.id)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${
                      phase.title
                    } topics`}
                  >
                    <ChevronDownIcon
                      size={14}
                      className={cx('chevron', isExpanded && 'is-rotated')}
                    />
                  </button>
                </div>

                {isExpanded && (
                  <ul className="sidebar-topics">
                    {phase.topics.map((topic) => (
                      <li key={topic.number}>
                        <Link
                          to={topicPath(topic.number)}
                          className={cx(
                            'sidebar-topic',
                            activeTopicNumber === topic.number && 'is-active',
                          )}
                          onClick={onNavigate}
                        >
                          <span className="sidebar-topic-number">
                            {pad(topic.number)}
                          </span>
                          <span className="sidebar-topic-title">
                            {topic.title}
                          </span>
                          {isComplete(topic.number) && (
                            <CheckIcon
                              size={12}
                              className="sidebar-topic-check"
                            />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-foot">
        <span>{phases.length} phases</span>
        <span>{totalTopics} topics</span>
      </div>
    </aside>
  );
}
