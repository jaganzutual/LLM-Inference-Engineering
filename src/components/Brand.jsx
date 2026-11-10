import { Link } from 'react-router-dom';

export default function Brand({ onClick }) {
  return (
    <Link
      className="brand"
      to="/"
      onClick={onClick}
      aria-label="Inference Engineering home"
    >
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="brand-word">
        inference<span>.engineering</span>
      </span>
    </Link>
  );
}
