import { useTheme } from '../lib/theme.jsx';
import { MoonIcon, SunIcon } from './Icons.jsx';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
