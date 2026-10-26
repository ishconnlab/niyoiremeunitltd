import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { COMPANY_INFO } from '../data/company';
import { isSupportedLanguage } from '../i18n';
import { contentValue, useCmsContent } from './useCmsContent';
import { applyAlternateLinks, buildUrl, OG_IMAGE_URL, setJsonLd, setMeta } from '../utils/seo';
import {
  buildBreadcrumbNode,
  buildFaqNode,
  buildOrganizationNode,
  buildServiceListNode,
  buildWebPageNode,
  buildWebsiteNode,
} from '../utils/structuredData';

export interface SeoOptions {
  /** Fully resolved page title (already translated and interpolated). */
  title: string;
  /** Fully resolved meta description. */
  description: string;
  /** Route path used for canonical and hreflang URLs. */
  path: string;
  /** Absolute or relative social sharing image. */
  image?: string;
  type?: 'website' | 'article';
  /** Prevents indexing (used by the 404 route). */
  noIndex?: boolean;
  /** Breadcrumb trail for nested routes, excluding the home page. */
  breadcrumbs?: { name: string; path: string }[];
  /** Service catalogue node (services overview page). */
  serviceList?: { name: string; description: string; path: string }[];
  /** FAQ node (FAQ page) built from the visible questions and answers. */
  faqs?: { question: string; answer: string }[];
  /** Extra structured data merged into the graph. */
  jsonLd?: Record<string, unknown>;
}

/**
 * Keeps document metadata in sync with the active route and language.
 * Titles, descriptions, canonical, hreflang and Open Graph tags are all
 * derived from the current language so the two languages never share a tag.
 */
export function useSeo({
  title,
  description,
  path,
  image = OG_IMAGE_URL,
  type = 'website',
  noIndex = false,
  breadcrumbs,
  serviceList,
  faqs,
  jsonLd,
}: SeoOptions): void {
  const location = useLocation();
  const { i18n } = useTranslation();
  const seoRecords = useCmsContent('seo');

  const language = useMemo(() => {
    const candidate = i18n.resolvedLanguage ?? i18n.language;
    return isSupportedLanguage(candidate) ? candidate : 'en';
  }, [i18n.resolvedLanguage, i18n.language]);

  const canonicalPath = path ?? location.pathname;
  const seoOverride = contentValue(seoRecords?.find((record) => record.key === canonicalPath));
  const pageTitle = typeof seoOverride.title === 'string' && seoOverride.title ? seoOverride.title : title;
  const pageDescription = typeof seoOverride.description === 'string' && seoOverride.description ? seoOverride.description : description;
  const pageImage = typeof seoOverride.image === 'string' && seoOverride.image ? seoOverride.image : image;

  useEffect(() => {
    document.title = pageTitle;

    setMeta('name', 'description', pageDescription);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDescription);
    setMeta('property', 'og:image', pageImage);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', COMPANY_INFO.name);
    setMeta('property', 'og:url', buildUrl(canonicalPath, language));
    setMeta('property', 'og:locale', 'en_US');
    document.head.querySelector('meta[property="og:locale:alternate"]')?.remove();

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', pageDescription);
    setMeta('name', 'twitter:image', pageImage);

    applyAlternateLinks(canonicalPath, language);
  }, [pageTitle, pageDescription, canonicalPath, pageImage, type, noIndex, language]);

  useEffect(() => {
    // A single `@graph` keeps the organization, website and page nodes linked
    // by `@id` so search engines read one consistent entity, not contradictions.
    const graph: unknown[] = [
      buildOrganizationNode(pageDescription, pageImage),
      buildWebsiteNode(language),
      buildWebPageNode(canonicalPath, language, pageTitle, pageDescription),
    ];

    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push(buildBreadcrumbNode(canonicalPath, language, breadcrumbs));
    }

    if (serviceList && serviceList.length > 0) {
      graph.push(buildServiceListNode(serviceList));
    }

    if (faqs && faqs.length > 0) {
      graph.push(buildFaqNode(faqs));
    }

    if (jsonLd) {
      graph.push(jsonLd);
    }

    setJsonLd({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }, [pageTitle, pageDescription, canonicalPath, pageImage, language, breadcrumbs, serviceList, faqs, jsonLd]);
}

