import { Outlet } from 'react-router-dom';
import MarketingHeader from './MarketingHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import SkipLink from './SkipLink.jsx';

export default function PublicLayout({ children }) {
  return (
    <div className="app public-app">
      <SkipLink />
      <MarketingHeader />
      <main id="main-content" className="public-main" tabIndex={-1}>
        {children ?? <Outlet />}
      </main>
      <SiteFooter />
    </div>
  );
}
