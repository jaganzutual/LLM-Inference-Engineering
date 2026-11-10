import { getVideoId } from '../data/videos.js';

export default function VideoEmbed({ topicNumber, title }) {
  const videoId = getVideoId(topicNumber);
  if (!videoId) return null;

  return (
    <div className="video-frame">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
