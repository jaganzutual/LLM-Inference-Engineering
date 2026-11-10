import { GithubStarsProvider } from './lib/github.jsx';
import { ProgressProvider } from './lib/progress.jsx';
import { ThemeProvider } from './lib/theme.jsx';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <GithubStarsProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </GithubStarsProvider>
    </ThemeProvider>
  );
}
