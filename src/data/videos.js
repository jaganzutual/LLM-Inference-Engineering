/**
 * YouTube walkthroughs, keyed by topic number.
 *
 * Add the video ID (the part after `v=` or after `youtu.be/`) when a
 * walkthrough is published, for example:
 *
 *   49: 'dQw4w9WgXcQ',
 *
 * The topic page will render a responsive player automatically.
 */
const videos = {};

export function getVideoId(topicNumber) {
  return videos[Number(topicNumber)] ?? null;
}

export default videos;
