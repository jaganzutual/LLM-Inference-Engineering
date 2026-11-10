import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  trackForTopic,
  trackPath,
  trackTopicPath,
  trackTopics,
  tracks,
  totalTrackTopics,
} from '../data/tracks.js';
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
      ? trackTopics
          .filter(
            (topic) =>
              topic.title.toLowerCase().includes(term) ||
              pad(topic.number).includes(term),
          )
          .slice(0, 8)
      : [];
    const trackMatches = tracks
      .filter(
        (track) =>
          !term ||
          track.title.toLowerCase().includes(term) ||
          track.shortTitle.toLowerCase().includes(term) ||
          track.tag.toLowerCase().includes(term) ||
          pad(track.id, 2) === term,
      )
      .slice(0, term ? 3 : 3);

    return [
      ...topicMatches.map((topic) => {
        const track = trackForTopic(topic.number);
        return {
          kind: 'topic',
          id: `topic-${topic.number}`,
          number: pad(topic.number),
          title: topic.title,
          meta: `Track ${pad(track.id, 2)} · ${track.shortTitle}`,
          href: trackTopicPath(track.id, topic.number),
        };
      }),
      ...trackMatches.map((track) => ({
        kind: 'track',
        id: `track-${track.id}`,
        number: pad(track.id, 2),
        title: track.title,
        meta: `${track.tag} · ${track.topics.length} topics`,
        href: trackPath(track.id),
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
        Search the tracks
      </h2>

      <div className="search-input-row">
        <SearchIcon size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${totalTrackTopics} topics or ${tracks.length} tracks…`}
          aria-label="Search topics and tracks"
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
            <p>No topics or tracks match “{query.trim()}”.</p>
            <span>Try a topic title, a track name, or a number like 049.</span>
          </div>
        ) : (
          results.map((result, index) => (
            <Fragment key={result.id}>
              {(index === 0 ||
                results[index - 1].kind !== result.kind) && (
                <div className="search-group">
                  {result.kind === 'topic' ? 'Topics' : 'Tracks'}
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
                  {result.kind === 'topic' ? 'Topic' : 'Track'}
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
