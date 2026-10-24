import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Languages } from 'lucide-react';

import { useLanguage } from '../../hooks/useLanguage';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n';
import { cn } from '../../utils/cn';

export interface LanguageSwitcherProps {
  /** `segmented` shows both options, `compact` shows the other language only. */
  variant?: 'segmented' | 'compact';
  className?: string;
  dark?: boolean;
}

/**
 * Language selector. The active language is mirrored into the `?lang=` query
 * parameter so every page can be shared in a specific language, and the choice
 * is persisted for the next visit.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'segmented',
  className,
  dark = false,
}) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const changeLanguage = (next: SupportedLanguage) => {
    if (next === language) return;

    const params = new URLSearchParams(searchParams);
    params.set('lang', next);
    setSearchParams(params, { replace: true });
    setLanguage(next);
  };

  const label = (lang: SupportedLanguage) => (lang === 'en' ? 'EN' : 'RW');

  if (variant === 'compact') {
    const next: SupportedLanguage = language === 'en' ? 'rw' : 'en';
    return (
      <button
        type="button"
        onClick={() => changeLanguage(next)}
        aria-label={
          next === 'en' ? t('common.switchToEnglish') : t('common.switchToKinyarwanda')
        }
        className={cn(
          'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors sm:min-h-10',
          dark
            ? 'border-white/30 text-white hover:bg-white/10'
            : 'border-slate-300 text-slate-700 hover:bg-slate-100',
          className
        )}
      >
        <Languages className="w-3.5 h-3.5" aria-hidden="true" />
        {label(next)}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={t('header.languageLabel')}
      className={cn(
        'inline-flex items-center rounded-full border p-0.5',
        dark ? 'border-white/25 bg-white/10' : 'border-slate-200 bg-slate-50',
        className
      )}
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = lang === language;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => changeLanguage(lang)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-bold transition-colors sm:px-3.5',
              isActive
                ? 'bg-brand-orange text-white shadow-sm'
                : dark
                  ? 'text-slate-200 hover:bg-white/10'
                  : 'text-slate-600 hover:bg-slate-200'
            )}
          >
            {label(lang)}
            <span className="sr-only">
              {lang === 'en' ? t('common.switchToEnglish') : t('common.switchToKinyarwanda')}
            </span>
          </button>
        );
      })}
    </div>
  );
};

