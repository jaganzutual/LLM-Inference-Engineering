import { cx } from '../lib/utils.js';

export default function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  label,
  className = '',
}) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div
      className={cx('progress', `progress-${size}`, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
    >
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}
