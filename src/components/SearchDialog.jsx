import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  allTopics,
  phaseForTopic,
  phasePath,
  phases,
  topicPath,
} from '../data/curriculum.js';
import { cx, pad } from '../lib/utils.js';
import {
  ChevronRightIcon,
  SearchIcon,
} from './Icons.jsx';

export default function SearchDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const topicMatches = term
      ? allTopics
          .filter(
            (topic) =>
              topic.title.toLowerCase().includes(term) ||
              pad(topic.number).includes(term),
          )
          .slice(0, 8)
      : [];
    const phaseMatches = phases
      .filter(
        (phase) =>
          !term ||
          phase.title.toLowerCase().includes(term) ||
          phase.tag.toLowerCase().includes(term) ||
          pad(phase.id, 2) === term,
      )
      .slice(0, term ? 4 : 10);

    return [
      ...topicMatches.map((topic) => {
        const phase = phaseForTopic(topic.number);
        return {
          kind: 'topic',
          id: `topic-${topic.number}`,
          number: pad(topic.number),
          title: topic.title,
          meta: `Phase ${pad(phase.id, 2)} · ${phase.title}`,
          href: topicPath(topic.number),
        };
      }),
      ...phaseMatches.map((phase) => ({
        kind: 'phase',
        id: `phase-${phase.id}`,
        number: pad(phase.id, 2),
        title: phase.title,
        meta: `${phase.tag} · ${phase.topics.length} topics`,
        href: phasePath(phase.id),
      })),
    ];
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      setQuery('');
      setActiveIndex(0);
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const active = document.getElementById(`search-result-${activeIndex}`);
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const goTo = (result) => {
    if (!result) return;
    onClose();
    navigate(result.href);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) =>
        Math.min(results.length - 1, current + 1),
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(0, current - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(0, results.length - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      goTo(results[activeIndex]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-labelledby="search-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <h2 id="search-title" className="sr-only">
        Search the curriculum
      </h2>

      <div className="search-input-row">
        <SearchIcon size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search 180 topics or 10 phases…"
          aria-label="Search topics and phases"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded="true"
          aria-activedescendant={
            results.length > 0 ? `search-result-${activeIndex}` : undefined
          }
        />
        <kbd>Esc</kbd>
      </div>

      <div
        id="search-results"
        className="search-results"
        role="listbox"
        aria-label="Search results"
      >
        {results.length === 0 ? (
          <div className="search-empty">
            <p>No topics or phases match “{query.trim()}”.</p>
            <span>Try a topic title, a phase name, or a number like 049.</span>
          </div>
        ) : (
          results.map((result, index) => (
            <Fragment key={result.id}>
              {(index === 0 ||
                results[index - 1].kind !== result.kind) && (
                <div className="search-group">
                  {result.kind === 'topic' ? 'Topics' : 'Phases'}
                </div>
              )}
              <button
                type="button"
                role="option"
                id={`search-result-${index}`}
                aria-selected={activeIndex === index}
                className={cx(
                  'search-result',
                  activeIndex === index && 'is-active',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goTo(result)}
              >
                <span className="search-result-number">{result.number}</span>
                <span className="search-result-copy">
                  <strong>{result.title}</strong>
                  <small>{result.meta}</small>
                </span>
                <span className="search-result-kind">
                  {result.kind === 'topic' ? 'Topic' : 'Phase'}
                </span>
                <ChevronRightIcon size={15} />
              </button>
            </Fragment>
          ))
        )}
      </div>

      <div className="search-footer">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> to navigate
        </span>
        <span>
          <kbd>↵</kbd> to open
        </span>
        <span>
          <kbd>Esc</kbd> to close
        </span>
      </div>

      <span className="sr-only" aria-live="polite">
        {results.length} results
      </span>
    </dialog>
  );
}
