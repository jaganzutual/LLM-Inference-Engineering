import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  allTopics,
  phases,
  totalTopics,
} from '../data/curriculum.js';

const STORAGE_KEY = 'inference:progress:v1';
const ProgressContext = createContext(null);

function readState() {
  if (typeof window === 'undefined') {
    return { completed: [], lastVisited: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [], lastVisited: null };

    const parsed = JSON.parse(raw);
    const completed = Array.isArray(parsed.completed)
      ? parsed.completed.filter(
          (number) =>
            Number.isInteger(number) && number >= 1 && number <= totalTopics,
        )
      : [];

    return {
      completed: [...new Set(completed)].sort((a, b) => a - b),
      lastVisited: Number.isInteger(parsed.lastVisited)
        ? parsed.lastVisited
        : null,
    };
  } catch {
    return { completed: [], lastVisited: null };
  }
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  }, [state]);

  useEffect(() => {
    const syncFromStorage = (event) => {
      if (event.key === STORAGE_KEY) setState(readState());
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const completedSet = useMemo(
    () => new Set(state.completed),
    [state.completed],
  );

  const toggle = useCallback((number) => {
    setState((current) => {
      const next = new Set(current.completed);
      if (next.has(number)) next.delete(number);
      else next.add(number);

      return {
        ...current,
        completed: [...next].sort((a, b) => a - b),
      };
    });
  }, []);

  const setLastVisited = useCallback((number) => {
    setState((current) =>
      current.lastVisited === number
        ? current
        : { ...current, lastVisited: number },
    );
  }, []);

  const isComplete = useCallback(
    (number) => completedSet.has(number),
    [completedSet],
  );

  const phaseStats = useMemo(() => {
    const result = {};

    for (const phase of phases) {
      const done = phase.topics.reduce(
        (count, topic) => count + (completedSet.has(topic.number) ? 1 : 0),
        0,
      );
      result[phase.id] = {
        done,
        total: phase.topics.length,
        percent: phase.topics.length
          ? Math.round((done / phase.topics.length) * 100)
          : 0,
      };
    }

    return result;
  }, [completedSet]);

  const nextTopic = useMemo(() => {
    const lastIndex = allTopics.findIndex(
      (topic) => topic.number === state.lastVisited,
    );

    if (lastIndex >= 0) {
      const lastVisited = allTopics[lastIndex];
      if (!completedSet.has(lastVisited.number)) return lastVisited;

      for (let offset = 1; offset <= allTopics.length; offset += 1) {
        const candidate =
          allTopics[(lastIndex + offset) % allTopics.length];
        if (!completedSet.has(candidate.number)) return candidate;
      }

      return lastVisited;
    }

    return (
      allTopics.find((topic) => !completedSet.has(topic.number)) ??
      allTopics[0]
    );
  }, [completedSet, state.lastVisited]);

  const nextTopicInPhase = useCallback(
    (phase) =>
      phase.topics.find((topic) => !completedSet.has(topic.number)) ??
      phase.topics[0],
    [completedSet],
  );

  const value = useMemo(
    () => ({
      completed: state.completed,
      completedCount: state.completed.length,
      percent: Math.round((state.completed.length / totalTopics) * 100),
      lastVisited: state.lastVisited,
      isComplete,
      toggle,
      setLastVisited,
      phaseStats,
      nextTopic,
      nextTopicInPhase,
    }),
    [
      isComplete,
      nextTopic,
      nextTopicInPhase,
      phaseStats,
      setLastVisited,
      state.completed,
      state.lastVisited,
      toggle,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used inside a ProgressProvider.');
  }
  return context;
}
