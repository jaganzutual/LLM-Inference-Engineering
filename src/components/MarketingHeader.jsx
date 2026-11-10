import { Link, useLocation, useNavigate } from 'react-router-dom';
import Brand from './Brand.jsx';
import GithubLink from './GithubLink.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { ArrowRightIcon } from './Icons.jsx';

export default function MarketingHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (id) => {
    if (location.pathname === '/tracks') {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    navigate('/tracks', { state: { scrollTo: id } });
  };

  return (
    <header className="site-header marketing-header">
      <div className="site-header-inner marketing-header-inner">
        <Brand />

        <nav className="marketing-nav" aria-label="Main navigation">
          <Link
            to="/tracks"
            aria-current={location.pathname === '/tracks' ? 'page' : undefined}
          >
            Tracks
          </Link>
          <button type="button" onClick={() => goToSection('how-it-works')}>
            How it works
          </button>
        </nav>

        <div className="header-spacer" />

        <GithubLink className="marketing-github" showLabel />
        <ThemeToggle />

        <Link className="btn btn-primary btn-sm marketing-cta" to="/tracks">
          <span className="cta-long">Start learning</span>
          <span className="cta-short">Start</span>
          <ArrowRightIcon size={15} />
        </Link>
      </div>
    </header>
  );
}
