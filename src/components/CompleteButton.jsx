import { useProgress } from '../lib/progress.jsx';
import { pad } from '../lib/utils.js';

export default function CompleteButton({ number, compact = false }) {
  const { isComplete, toggle } = useProgress();
  const completed = isComplete(number);

  return (
    <button
      type="button"
      className={`complete-button${compact ? ' is-compact' : ''}${
        completed ? ' is-complete' : ''
      }`}
      onClick={() => toggle(number)}
      aria-pressed={completed}
      aria-label={
        completed
          ? `Mark topic ${pad(number)} as not complete`
          : `Mark topic ${pad(number)} complete`
      }
      title={completed ? 'Completed' : 'Mark complete'}
    >
      <span className="complete-icon" aria-hidden="true">
        {completed ? (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="m5 12.5 4.2 4.2L19 6.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="7.5"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        )}
      </span>
      {!compact && (
        <span>{completed ? 'Completed' : 'Mark complete'}</span>
      )}
    </button>
  );
}
