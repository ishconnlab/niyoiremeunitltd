import { useCallback } from 'react';

/** Keeps the link abstraction while using clean English-only routes. */
export function useLocalizedPath(): (path: string) => string {
  return useCallback((path: string) => path, []);
}

