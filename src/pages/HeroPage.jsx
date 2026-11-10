import { Link } from 'react-router-dom';
import {
  trackPath,
  trackTopicPath,
  tracks,
  totalTrackTopics,
} from '../data/tracks.js';
import { useProgress } from '../lib/progress.jsx';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import GithubLink from '../components/GithubLink.jsx';
import {
  ArrowRightIcon,
  ChevronRightIcon,
} from '../components/Icons.jsx';
import { pad } from '../lib/utils.js';

export default function HeroPage() {
  useDocumentTitle('Inference Engineering — Learn how LLMs actually run');

  const {
    completedCount,
    trackStats,
    continueTrack,
    nextTrackTopic,
  } = useProgress();
  const hasProgress = completedCount > 0;
  const allDone = completedCount === totalTrackTopics;

  return (
    <div className="hero-page">
      <section className="hero-page-inner">
        <div className="hero-page-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> A focused learning path
          </p>

          <h1>
            Learn how LLMs
            <br />
            <span>actually run.</span>
          </h1>

          <p className="hero-lead">
            Three focused tracks covering the foundations, inference, and GPU
            performance. Pick one, go deep, and track every topic you finish.
          </p>

          <div className="hero-actions">
            {hasProgress && !allDone ? (
              <Link
                className="btn btn-primary"
                to={trackTopicPath(
                  continueTrack.id,
                  nextTrackTopic.number,
                )}
              >
                Continue {continueTrack.shortTitle}
                <ArrowRightIcon size={16} />
              </Link>
            ) : (
              <Link className="btn btn-primary" to="/tracks">
                Choose a track
                <ArrowRightIcon size={16} />
              </Link>
            )}

            <GithubLink
              className="btn btn-secondary hero-github"
              showLabel
              label="Star on GitHub"
            />
          </div>

          <div className="hero-facts">
            <span>
              <strong>3</strong> focused tracks
            </span>
            <span>
              <strong>{totalTrackTopics}</strong> ordered topics
            </span>
            <span>
              <strong>Self-paced</strong> · progress saved locally
            </span>
          </div>
        </div>

        <aside className="hero-index" aria-label="Available tracks">
          <div className="hero-index-head">
            <span>Three tracks</span>
            <span>Pick one</span>
          </div>

          {tracks.map((track) => {
            const stats = trackStats[track.id];
            const current = hasProgress && continueTrack.id === track.id;

            return (
              <Link
                className={`hero-index-row${current ? ' is-current' : ''}`}
                to={trackPath(track.id)}
                key={track.id}
              >
                <span className="hero-index-number">
                  {pad(track.id, 2)}
                </span>
                <span className="hero-index-copy">
                  <strong>{track.shortTitle}</strong>
                  <small>{track.title}</small>
                </span>
                <span className="hero-index-meta">
                  {stats.done > 0
                    ? `${stats.done}/${stats.total}`
                    : `${stats.total} topics`}
                </span>
                <ChevronRightIcon size={16} />
              </Link>
            );
          })}

          <div className="hero-index-foot">
            <span>New to inference?</span>
            <Link to={trackPath(1)}>
              Start with foundations <ArrowRightIcon size={14} />
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
