import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = 'niyoireme.lang';

export const isSupportedLanguage = (value: string | null | undefined): value is SupportedLanguage =>
  !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

void i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: { en: { translation: en } },
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: 'en',
    interpolation: {
      // React already escapes interpolated values.
      escapeValue: false,
    },
  });

/** Keep the document element in sync with the active language. */
const applyDocumentLanguage = (language: string) => {
  if (typeof document === 'undefined') return;
  const active = isSupportedLanguage(language) ? language : 'en';
  document.documentElement.lang = active;
  document.documentElement.setAttribute('dir', 'ltr');
};

applyDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);
i18n.on('languageChanged', applyDocumentLanguage);

export default i18n;

