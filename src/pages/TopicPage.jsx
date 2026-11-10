import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  allTopics,
  phaseForTopic,
  phasePath,
  topicByNumber,
  topicPath,
} from '../data/curriculum.js';
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
  const { topicNumber } = useParams();
  const topic = topicByNumber(topicNumber);

  if (!topic) return <NotFoundPage />;
  return <TopicDetail topic={topic} />;
}

function TopicDetail({ topic }) {
  useDocumentTitle(`${topic.title} — Inference Engineering`);

  const phase = phaseForTopic(topic.number);
  const index = allTopics.findIndex((item) => item.number === topic.number);
  const previousTopic = index > 0 ? allTopics[index - 1] : null;
  const nextTopic =
    index < allTopics.length - 1 ? allTopics[index + 1] : null;

  const { phaseStats, isComplete, setLastVisited } = useProgress();
  const stats = phaseStats[phase.id];
  const complete = isComplete(topic.number);

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
          { label: 'Curriculum', to: '/' },
          { label: `Phase ${pad(phase.id, 2)}`, to: phasePath(phase.id) },
          { label: `Topic ${pad(topic.number)}` },
        ]}
      />

      <header className="topic-head">
        <p className="eyebrow">
          Phase {pad(phase.id, 2)} · {phase.tag} · Topic{' '}
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
                now, use the phase outline to keep moving, or mark this topic
                complete after studying it your own way.
              </p>
              <div className="empty-actions">
                <Link
                  className="btn btn-secondary"
                  to={phasePath(phase.id)}
                >
                  <ArrowLeftIcon size={15} /> Back to phase
                </Link>
                {nextTopic && (
                  <Link
                    className="btn btn-primary"
                    to={topicPath(nextTopic.number)}
                  >
                    Next topic <ArrowRightIcon size={15} />
                  </Link>
                )}
              </div>
              <p className="empty-note">
                Lessons are added as the path is written.
              </p>
            </section>
          )}

          <section className="lesson-complete">
            <div>
              <h2>{complete ? 'Topic complete' : 'Finished this topic?'}</h2>
              <p>
                {complete
                  ? 'Nice. Keep the momentum going with the next topic.'
                  : 'Mark it complete to keep track of where you are in the path.'}
              </p>
            </div>
            <CompleteButton number={topic.number} />
          </section>

          <nav className="topic-pager" aria-label="Topic navigation">
            {previousTopic ? (
              <Link
                className="pager-card prev"
                to={topicPath(previousTopic.number)}
              >
                <span>
                  <ArrowLeftIcon size={14} /> Previous topic
                </span>
                <strong>{previousTopic.title}</strong>
              </Link>
            ) : (
              <span className="pager-spacer" aria-hidden="true" />
            )}

            {nextTopic ? (
              <Link
                className="pager-card next"
                to={topicPath(nextTopic.number)}
              >
                <span>
                  Next topic <ArrowRightIcon size={14} />
                </span>
                <strong>{nextTopic.title}</strong>
              </Link>
            ) : (
              <span className="pager-spacer" aria-hidden="true" />
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
            <h2>Phase {pad(phase.id, 2)} progress</h2>
            <div className="rail-progress">
              <strong>{stats.done}</strong>
              <span>/ {stats.total} complete</span>
            </div>
            <ProgressBar
              value={stats.done}
              max={stats.total}
              size="sm"
              label={`${phase.title} progress`}
            />
            <Link className="rail-link" to={phasePath(phase.id)}>
              View phase <ArrowRightIcon size={14} />
            </Link>
          </section>

          <section className="rail-card rail-phase-card">
            <h2>In this phase</h2>
            <ol className="rail-phase-list">
              {phase.topics.map((item) => {
                const current = item.number === topic.number;
                const done = isComplete(item.number);

                return (
                  <li key={item.number}>
                    <Link
                      to={topicPath(item.number)}
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
