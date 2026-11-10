import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const REPO_API =
  'https://api.github.com/repos/jaganzutual/LLM-Inference-Engineering';
const CACHE_KEY = 'inference:github-stars:v1';
const MAX_AGE = 60 * 60 * 1000;
const GithubStarsContext = createContext(null);

function readCache() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      Number.isInteger(parsed.count) &&
      Number.isFinite(parsed.timestamp)
    ) {
      return parsed;
    }
  } catch {
    // Ignore malformed or unavailable storage.
  }

  return null;
}

export function GithubStarsProvider({ children }) {
  const [stars, setStars] = useState(() => readCache()?.count ?? null);

  useEffect(() => {
    const cached = readCache();
    if (cached && Date.now() - cached.timestamp < MAX_AGE) {
      setStars(cached.count);
      return undefined;
    }

    const controller = new AbortController();

    fetch(REPO_API, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data || !Number.isInteger(data.stargazers_count)) return;
        setStars(data.stargazers_count);
        try {
          window.localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              count: data.stargazers_count,
              timestamp: Date.now(),
            }),
          );
        } catch {
          // The count still displays for this session.
        }
      })
      .catch(() => {
        // Keep the cached value, if any.
      });

    return () => controller.abort();
  }, []);

  return (
    <GithubStarsContext.Provider value={stars}>
      {children}
    </GithubStarsContext.Provider>
  );
}

export function useGithubStars() {
  return useContext(GithubStarsContext);
}
