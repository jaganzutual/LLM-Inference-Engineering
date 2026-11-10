import { Link } from 'react-router-dom';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import { ArrowLeftIcon } from '../components/Icons.jsx';

export default function NotFoundPage() {
  useDocumentTitle('Page not found — Inference Engineering');

  return (
    <div className="page not-found-page">
      <p className="eyebrow">404</p>
      <h1>That page is not part of the path.</h1>
      <p className="lead">
        The link may be old, or the topic may have moved. Head back to the
        curriculum and pick up where you left off.
      </p>
      <Link className="btn btn-primary" to="/">
        <ArrowLeftIcon size={16} /> Back to the curriculum
      </Link>
    </div>
  );
}
