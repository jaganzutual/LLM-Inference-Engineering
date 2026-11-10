import { Link, useParams } from 'react-router-dom';
import {
  trackById,
  trackPath,
  trackTopicPath,
  tracks,
} from '../data/tracks.js';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
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

  const firstTopic = track.topics[0];
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

        <aside className="track-start-card">
          <span className="track-start-label">
            Track {pad(track.id, 2)}
          </span>
          <strong>{track.topics.length} topics</strong>
          <p>
            Self-paced. Start with the first topic, or browse the full list
            below.
          </p>
          {firstTopic && (
            <Link
              className="btn btn-primary"
              to={trackTopicPath(track.id, firstTopic.number)}
            >
              Start track
              <ArrowRightIcon size={16} />
            </Link>
          )}
        </aside>
      </section>

      <section className="track-topics" aria-labelledby="track-topics-title">
        <div className="section-heading compact">
          <div>
            <h2 id="track-topics-title">Track topics</h2>
          </div>
          <p>{track.topics.length} topics</p>
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
