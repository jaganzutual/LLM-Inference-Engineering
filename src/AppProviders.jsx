import { GithubStarsProvider } from './lib/github.jsx';
import { ThemeProvider } from './lib/theme.jsx';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <GithubStarsProvider>{children}</GithubStarsProvider>
    </ThemeProvider>
  );
}
