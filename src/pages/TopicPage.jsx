import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  trackById,
  trackPath,
  trackTopicPath,
  tracks,
} from '../data/tracks.js';
import { getVideoId } from '../data/videos.js';
import {
  estimateReadTime,
  extractHeadings,
  hasNotes,
  loadNotes,
} from '../lib/content.js';
import { useProgress } from '../lib/progress.jsx';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import { cx, pad } from '../lib/utils.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import CompleteButton from '../components/CompleteButton.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import VideoEmbed from '../components/VideoEmbed.jsx';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  ClockIcon,
  PlayIcon,
} from '../components/Icons.jsx';
import NotFoundPage from './NotFoundPage.jsx';

const Markdown = lazy(() => import('../components/Markdown.jsx'));

export default function TopicPage() {
  const { trackId, topicNumber } = useParams();
  const track = trackById(trackId);
  const topic = track?.topics.find(
    (item) => item.number === Number(topicNumber),
  );

  if (!track || !topic) return <NotFoundPage />;
  return <TopicDetail track={track} topic={topic} />;
}

function TopicDetail({ track, topic }) {
  useDocumentTitle(`${topic.title} — ${track.shortTitle} — Inference Engineering`);

  const index = track.topics.findIndex(
    (item) => item.number === topic.number,
  );
  const previousTopic = index > 0 ? track.topics[index - 1] : null;
  const nextTopic =
    index < track.topics.length - 1 ? track.topics[index + 1] : null;

  const { trackStats, isComplete, setLastVisited } = useProgress();
  const stats = trackStats[track.id];
  const complete = isComplete(topic.number);
  const otherTracks = tracks.filter((item) => item.id !== track.id);

  const notesAvailable = hasNotes(topic.number);
  const [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(notesAvailable);
  const videoId = getVideoId(topic.number);

  useEffect(() => {
    setLastVisited(topic.number);
  }, [setLastVisited, topic.number]);

  useEffect(() => {
    let active = true;

    if (!notesAvailable) {
      setMarkdown(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    loadNotes(topic.number).then((text) => {
      if (!active) return;
      setMarkdown(text);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [notesAvailable, topic.number]);

  const headings = useMemo(() => extractHeadings(markdown), [markdown]);
  const readTime = useMemo(() => estimateReadTime(markdown), [markdown]);

  const scrollToHeading = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page topic-page">
      <Breadcrumbs
        items={[
          { label: 'Tracks', to: '/tracks' },
          { label: `Track ${pad(track.id, 2)}`, to: trackPath(track.id) },
          { label: `Topic ${pad(topic.number)}` },
        ]}
      />

      <header className="topic-head">
        <p className="eyebrow">
          Track {pad(track.id, 2)} · {track.tag} · Topic{' '}
          {pad(topic.number)}
        </p>
        <h1>{topic.title}</h1>
        <div className="topic-meta">
          <span className="meta-item">
            {notesAvailable ? (
              <>
                <ClockIcon size={14} />{' '}
                {readTime
                  ? `${readTime} min read`
                  : loading
                    ? 'Loading notes…'
                    : 'Notes'}
              </>
            ) : (
              <>
                <BookOpenIcon size={14} /> Notes in progress
              </>
            )}
          </span>
          <span className="meta-item">
            <PlayIcon size={14} />{' '}
            {videoId ? 'Video walkthrough' : 'Video coming soon'}
          </span>
          <CompleteButton number={topic.number} />
        </div>
      </header>

      {videoId && (
        <VideoEmbed topicNumber={topic.number} title={topic.title} />
      )}

      <div className="topic-layout">
        <div className="topic-main">
          {loading && !markdown ? (
            <ArticleSkeleton />
          ) : markdown ? (
            <Suspense fallback={<ArticleSkeleton />}>
              <Markdown>{markdown}</Markdown>
            </Suspense>
          ) : (
            <section className="empty-lesson">
              <span className="empty-icon">
                <BookOpenIcon size={22} />
              </span>
              <p className="eyebrow">Lesson in progress</p>
              <h2>Notes for this topic are on the way.</h2>
              <p>
                The written lesson and video walkthrough will appear here. For
                now, use the track outline to keep moving, or mark this topic
                complete after studying it your own way.
              </p>
              <div className="empty-actions">
                <Link
                  className="btn btn-secondary"
                  to={trackPath(track.id)}
                >
                  <ArrowLeftIcon size={15} /> Back to track
                </Link>
                {nextTopic && (
                  <Link
                    className="btn btn-primary"
                    to={trackTopicPath(track.id, nextTopic.number)}
                  >
                    Next topic <ArrowRightIcon size={15} />
                  </Link>
                )}
              </div>
              <p className="empty-note">
                Lessons are added as the track is written.
              </p>
            </section>
          )}

          <section className="lesson-complete">
            <div>
              <h2>{complete ? 'Topic complete' : 'Finished this topic?'}</h2>
              <p>
                {complete
                  ? 'Nice. Keep the momentum going with the next topic.'
                  : 'Mark it complete to keep track of where you are in the track.'}
              </p>
            </div>
            <CompleteButton number={topic.number} />
          </section>

          {!nextTopic && complete && (
            <section className="track-complete-card">
              <p className="eyebrow">Track complete</p>
              <h2>You finished {track.shortTitle}.</h2>
              <p>
                All {stats.total} topics in this track are complete. Pick
                another track to keep going.
              </p>
              <div className="track-complete-actions">
                {otherTracks.map((item) => (
                  <Link
                    className="btn btn-secondary"
                    to={trackPath(item.id)}
                    key={item.id}
                  >
                    Track {pad(item.id, 2)} · {item.shortTitle}
                    <ArrowRightIcon size={15} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <nav className="topic-pager" aria-label="Topic navigation">
            {previousTopic ? (
              <Link
                className="pager-card prev"
                to={trackTopicPath(track.id, previousTopic.number)}
              >
                <span>
                  <ArrowLeftIcon size={14} /> Previous topic
                </span>
                <strong>{previousTopic.title}</strong>
              </Link>
            ) : (
              <Link
                className="pager-card prev"
                to={trackPath(track.id)}
              >
                <span>
                  <ArrowLeftIcon size={14} /> Track overview
                </span>
                <strong>{track.title}</strong>
              </Link>
            )}

            {nextTopic ? (
              <Link
                className="pager-card next"
                to={trackTopicPath(track.id, nextTopic.number)}
              >
                <span>
                  Next topic <ArrowRightIcon size={14} />
                </span>
                <strong>{nextTopic.title}</strong>
              </Link>
            ) : (
              <Link
                className="pager-card next"
                to={trackPath(track.id)}
              >
                <span>
                  Track overview <ArrowRightIcon size={14} />
                </span>
                <strong>{track.title}</strong>
              </Link>
            )}
          </nav>
        </div>

        <aside className="topic-rail">
          {headings.length > 0 && (
            <section className="rail-card">
              <h2>On this page</h2>
              <nav className="rail-toc" aria-label="On this page">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    type="button"
                    className={cx(
                      'rail-toc-link',
                      heading.depth === 3 && 'is-nested',
                    )}
                    onClick={() => scrollToHeading(heading.id)}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </section>
          )}

          <section className="rail-card">
            <h2>Track {pad(track.id, 2)} progress</h2>
            <div className="rail-progress">
              <strong>{stats.done}</strong>
              <span>/ {stats.total} complete</span>
            </div>
            <ProgressBar
              value={stats.done}
              max={stats.total}
              size="sm"
              label={`${track.title} progress`}
            />
            <Link className="rail-link" to={trackPath(track.id)}>
              View track <ArrowRightIcon size={14} />
            </Link>
          </section>

          <section className="rail-card rail-track-card">
            <h2>In this track</h2>
            <ol className="rail-track-list">
              {track.topics.map((item) => {
                const current = item.number === topic.number;
                const done = isComplete(item.number);

                return (
                  <li key={item.number}>
                    <Link
                      to={trackTopicPath(track.id, item.number)}
                      className={cx(
                        'rail-topic',
                        current && 'is-active',
                      )}
                      aria-current={current ? 'page' : undefined}
                    >
                      <span className="rail-topic-number">
                        {pad(item.number)}
                      </span>
                      <span className="rail-topic-title">{item.title}</span>
                      {done && (
                        <CheckIcon size={12} className="rail-topic-check" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="article-skeleton" aria-hidden="true">
      <span className="skeleton-line is-wide" />
      <span className="skeleton-line" />
      <span className="skeleton-line is-short" />
      <span className="skeleton-line is-heading" />
      <span className="skeleton-line is-wide" />
      <span className="skeleton-line" />
      <span className="skeleton-line is-short" />
    </div>
  );
}
