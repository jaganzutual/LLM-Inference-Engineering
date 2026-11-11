import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  trackById,
  trackPath,
  trackTopicPath,
} from '../data/tracks.js';
import { getVideoId } from '../data/videos.js';
import {
  estimateReadTime,
  extractHeadings,
  hasNotes,
  loadNotes,
} from '../lib/content.js';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import { cx, pad } from '../lib/utils.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import TopicSidebar from '../components/TopicSidebar.jsx';
import VideoEmbed from '../components/VideoEmbed.jsx';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
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
  useDocumentTitle(
    `${topic.title} — ${track.shortTitle} — Inference Engineering`,
  );

  const index = track.topics.findIndex(
    (item) => item.number === topic.number,
  );
  const previousTopic = index > 0 ? track.topics[index - 1] : null;
  const nextTopic =
    index < track.topics.length - 1 ? track.topics[index + 1] : null;

  const notesAvailable = hasNotes(topic.number);
  const [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(notesAvailable);
  const videoId = getVideoId(topic.number);

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
  const focused = headings.length === 0;

  const scrollToHeading = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="topic-workspace">
      <TopicSidebar
        track={track}
        activeTopicNumber={topic.number}
      />

      <div className={cx('page topic-page', focused && 'is-focused')}>
        <Breadcrumbs
        items={[
          { label: 'Tracks', to: '/tracks' },
          { label: `Track ${pad(track.id, 2)}`, to: trackPath(track.id) },
          { label: `Topic ${pad(topic.number)}` },
        ]}
      />

      <header className="topic-head">
        <h1>{topic.title}</h1>
        <div className="topic-meta">
          {notesAvailable && (
            <span className="meta-item">
              <ClockIcon size={14} />{' '}
              {readTime
                ? `${readTime} min read`
                : loading
                  ? 'Loading notes…'
                  : 'Notes'}
            </span>
          )}
          <span className="meta-item">
            <PlayIcon size={14} />{' '}
            {videoId ? 'Video walkthrough' : 'Video coming soon'}
          </span>
        </div>
      </header>

      {videoId && (
        <VideoEmbed topicNumber={topic.number} title={topic.title} />
      )}

      <div className={cx('topic-layout', focused && 'is-single')}>
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
              <h2>Notes for this topic are on the way.</h2>
              <p>
                The written lesson and video walkthrough will appear here. Use
                the track contents to keep moving, or jump to the next topic
                below.
              </p>
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
              <Link className="pager-card prev" to={trackPath(track.id)}>
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
              <Link className="pager-card next" to={trackPath(track.id)}>
                <span>
                  Track overview <ArrowRightIcon size={14} />
                </span>
                <strong>{track.title}</strong>
              </Link>
            )}
          </nav>
        </div>

        {headings.length > 0 && (
          <aside className="topic-rail">
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
          </aside>
        )}
        </div>
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
