import { useGithubStars } from '../lib/github.jsx';
import { cx } from '../lib/utils.js';
import {
  GithubIcon,
  StarIcon,
} from './Icons.jsx';

export default function GithubLink({
  className = '',
  label = 'GitHub',
  showLabel = false,
}) {
  const stars = useGithubStars();

  return (
    <a
      className={cx('github-link', className)}
      href="https://github.com/jaganzutual/LLM-Inference-Engineering"
      target="_blank"
      rel="noreferrer"
      aria-label={
        stars === null
          ? 'View the project on GitHub'
          : `View the project on GitHub, ${stars.toLocaleString()} stars`
      }
      title="View on GitHub"
    >
      <GithubIcon size={16} />
      {showLabel && <span className="github-link-label">{label}</span>}
      {stars !== null && (
        <span className="github-stars">
          <StarIcon size={11} />
          {stars.toLocaleString()}
        </span>
      )}
    </a>
  );
}
