import { Link } from 'react-router-dom';
import { trackTopicPath } from '../data/tracks.js';
import { getVideoId } from '../data/videos.js';
import { hasNotes } from '../lib/content.js';
import { pad } from '../lib/utils.js';
import {
  ChevronRightIcon,
  PlayIcon,
} from './Icons.jsx';

export default function TopicRow({ topic, trackId }) {
  const notes = hasNotes(topic.number);
  const video = getVideoId(topic.number);

  return (
    <div className="topic-row">
      <Link
        className="topic-row-link"
        to={trackTopicPath(trackId, topic.number)}
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
    </div>
  );
}
