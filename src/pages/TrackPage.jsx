import { Link, useParams } from 'react-router-dom';
import {
  trackById,
  trackPath,
  trackTopicPath,
  tracks,
} from '../data/tracks.js';
import { useProgress } from '../lib/progress.jsx';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import TopicRow from '../components/TopicRow.jsx';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
} from '../components/Icons.jsx';
import { pad } from '../lib/utils.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function TrackPage() {
  const { trackId } = useParams();
  const track = trackById(trackId);

  if (!track) return <NotFoundPage />;
  return <TrackDetail track={track} />;
}

function TrackDetail({ track }) {
  useDocumentTitle(`${track.title} — Inference Engineering`);

  const { trackStats, nextTopicInTrack } = useProgress();
  const stats = trackStats[track.id];
  const complete = stats.done === stats.total;
  const nextTopic = nextTopicInTrack(track);
  const otherTracks = tracks.filter((item) => item.id !== track.id);

  return (
    <div className="page track-page">
      <Breadcrumbs
        items={[
          { label: 'Tracks', to: '/tracks' },
          { label: `Track ${pad(track.id, 2)}` },
        ]}
      />

      <section className="track-hero">
        <div className="track-hero-copy">
          <h1>{track.title}</h1>
          <p className="lead">{track.summary}</p>

          <div className="track-outcomes">
            <h2>What you will learn</h2>
            <ul>
              {track.outcomes.map((outcome) => (
                <li key={outcome}>
                  <CheckIcon size={14} />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="track-progress-card">
          <div className="track-progress-head">
            <span>Your progress</span>
            <span>{stats.percent}%</span>
          </div>
          <div className="track-progress-value">
            <strong>{stats.done}</strong>
            <span>/ {stats.total} topics</span>
          </div>
          <ProgressBar
            value={stats.done}
            max={stats.total}
            label={`${track.title} progress`}
          />
          <Link
            className="btn btn-primary"
            to={trackTopicPath(track.id, nextTopic.number)}
          >
            {complete
              ? 'Review track'
              : stats.done > 0
                ? 'Continue track'
                : 'Start track'}
            <ArrowRightIcon size={16} />
          </Link>
          {complete ? (
            <p className="track-progress-note">
              You completed all {stats.total} topics in this track.
            </p>
          ) : (
            <p className="track-progress-note">
              Progress is saved automatically in this browser.
            </p>
          )}
        </aside>
      </section>

      <section className="track-topics" aria-labelledby="track-topics-title">
        <div className="section-heading compact">
          <div>
            <h2 id="track-topics-title">Track topics</h2>
          </div>
          <p>
            {stats.total} topics · {stats.done} complete
          </p>
        </div>

        <div className="topic-list-card">
          {track.topics.map((topic) => (
            <TopicRow
              key={topic.number}
              topic={topic}
              trackId={track.id}
            />
          ))}
        </div>
      </section>

      <section className="track-switch-section">
        <div className="section-heading compact">
          <div>
            <h2>Explore another track</h2>
          </div>
          <p>Each track is self-contained.</p>
        </div>

        <div className="track-switch-grid">
          {otherTracks.map((item) => (
            <Link
              className="track-switch-card"
              to={trackPath(item.id)}
              key={item.id}
            >
              <span className="track-switch-index">
                Track {pad(item.id, 2)}
              </span>
              <strong>{item.title}</strong>
              <span className="track-switch-meta">
                {item.topics.length} topics
              </span>
              <ArrowUpRightIcon size={16} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
