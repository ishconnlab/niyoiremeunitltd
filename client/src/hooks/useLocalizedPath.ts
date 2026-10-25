import { useCallback } from 'react';

import { useLanguage } from './useLanguage';

/**
 * Builds an internal path that carries the active language in the `?lang=`
 * query parameter. Every internal link uses this so a shared URL always opens
 * in the language the visitor chose, and the nav never falls back to the
 * browser default.
 */
export function useLocalizedPath(): (path: string) => string {
  const { language } = useLanguage();

  return useCallback(
    (path: string) => {
      if (!path.startsWith('/')) return path;

      const [pathname, search = ''] = path.split('?');
      const params = new URLSearchParams(search);
      params.set('lang', language);

      return `${pathname}?${params.toString()}`;
    },
    [language]
  );
}

