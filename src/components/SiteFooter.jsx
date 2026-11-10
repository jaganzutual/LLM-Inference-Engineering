import { Link } from 'react-router-dom';
import Brand from './Brand.jsx';
import GithubLink from './GithubLink.jsx';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Brand />
        <p>A focused path through LLM inference engineering.</p>
        <Link to="/tracks">Tracks</Link>
        <span className="footer-credit">Built in public</span>
        <GithubLink showLabel label="GitHub" />
      </div>
    </footer>
  );
}
