import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_STORAGE_KEY, isSupportedLanguage, type SupportedLanguage } from '../i18n';

export interface LanguageApi {
  language: SupportedLanguage;
  isKinyarwanda: boolean;
  setLanguage: (language: SupportedLanguage) => void;
  toggleLanguage: () => void;
}

export function useLanguage(): LanguageApi {
  const { i18n } = useTranslation();

  const language = useMemo(() => {
    const candidate = i18n.resolvedLanguage ?? i18n.language;
    return isSupportedLanguage(candidate) ? candidate : 'en';
  }, [i18n.resolvedLanguage, i18n.language]);

  const setLanguage = useCallback(
    (next: SupportedLanguage) => {
      void i18n.changeLanguage(next);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      } catch {
        /* Storage can be unavailable in private browsing â€” language still applies. */
      }
    },
    [i18n]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'rw' : 'en');
  }, [language, setLanguage]);

  return { language, isKinyarwanda: language === 'rw', setLanguage, toggleLanguage };
}

