import { COMPANY_INFO } from '../data/company';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

/** Origin without a trailing slash. */
export const SITE_ORIGIN = COMPANY_INFO.siteUrl.replace(/\/+$/, '');

/** Absolute URL for a path + language, e.g. `/services?lang=rw`. */
export const buildUrl = (path: string, language: SupportedLanguage): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withoutQuery = normalized.split('?')[0];
  return `${SITE_ORIGIN}${withoutQuery}?lang=${language}`;
};

/** Absolute URL for the social sharing image. */
export const OG_IMAGE_URL = `${SITE_ORIGIN}/assets/brand/og-image.png`;

export const setMeta = (attr: 'name' | 'property', key: string, content: string): void => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export const setLink = (rel: string, href: string): void => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

export const removeLink = (rel: string): void => {
  document.head.querySelector(`link[rel="${rel}"]`)?.remove();
};

/**
 * Emit canonical + hreflang alternates for the current route.
 * The language is expressed as a `?lang=` query so the route itself stays stable.
 */
export const applyAlternateLinks = (path: string, language: SupportedLanguage): void => {
  setLink('canonical', buildUrl(path, language));

  SUPPORTED_LANGUAGES.forEach((lang) => {
    setLink(`alternate-${lang}`, buildUrl(path, lang));
  });
  setLink('alternate-x-default', buildUrl(path, 'en'));
};

/**
 * Replace the JSON-LD block. Only one block is emitted at a time so search
 * engines never see contradictory structured data.
 */
export const setJsonLd = (data: unknown): void => {
  const existing = document.getElementById('niyoireme-jsonld');
  existing?.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'niyoireme-jsonld';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

