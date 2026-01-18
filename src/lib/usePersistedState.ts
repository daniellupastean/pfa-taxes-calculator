import { useState, useEffect, useCallback } from 'react';

export function usePersistedState<T>(
  key: string,
  initialValue: T,
  options?: {
    migrate?: (stored: unknown) => T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) {
        return initialValue;
      }
      const parsed = JSON.parse(stored);
      if (options?.migrate) {
        return options.migrate(parsed);
      }
      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [key, state]);

  const setPersistedState: React.Dispatch<React.SetStateAction<T>> = useCallback((value) => {
    setState((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      return nextValue;
    });
  }, []);

  return [state, setPersistedState];
}
