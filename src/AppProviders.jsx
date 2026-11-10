import { ProgressProvider } from './lib/progress.jsx';
import { ThemeProvider } from './lib/theme.jsx';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </ThemeProvider>
  );
}
