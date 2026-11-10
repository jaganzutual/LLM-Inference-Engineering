import { Link } from 'react-router-dom';
import { getVideoId } from '../data/videos.js';
import { hasNotes } from '../lib/content.js';
import { useProgress } from '../lib/progress.jsx';
import { cx, pad } from '../lib/utils.js';
import CompleteButton from './CompleteButton.jsx';
import {
  ChevronRightIcon,
  PlayIcon,
} from './Icons.jsx';

export default function TopicRow({ topic }) {
  const { isComplete } = useProgress();
  const completed = isComplete(topic.number);
  const notes = hasNotes(topic.number);
  const video = getVideoId(topic.number);

  return (
    <div className={cx('topic-row', completed && 'is-complete')}>
      <Link
        className="topic-row-link"
        to={`/topic/${topic.number}`}
        aria-label={`Topic ${pad(topic.number)}: ${topic.title}`}
      >
        <span className="topic-number">{pad(topic.number)}</span>
        <span className="topic-body">
          <span className="topic-title">{topic.title}</span>
          {(notes || video) && (
            <span className="topic-badges">
              {notes && <span className="badge badge-notes">Notes</span>}
              {video && (
                <span className="badge badge-video">
                  <PlayIcon size={9} /> Video
                </span>
              )}
            </span>
          )}
        </span>
        <ChevronRightIcon size={16} className="topic-chevron" />
      </Link>
      <CompleteButton number={topic.number} compact />
    </div>
  );
}
