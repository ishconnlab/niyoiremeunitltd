import { COMPANY_INFO } from '../data/company';
import { FAQS_DATA } from '../data/faqs';
import { SERVICES_DATA } from '../data/services';
import type { SupportedLanguage } from '../i18n';
import { SITE_ORIGIN } from './seo';

/**
 * JSON-LD builders.
 *
 * Only verified business facts are emitted (name, phone, email, neighbourhood
 * location, the four real service divisions). Nothing here invents ratings,
 * reviews, certifications, opening dates or coverage the company has not
 * confirmed. Everything is derived from `COMPANY_INFO`, the service list and
 * the visible FAQ content so the structured data never contradicts the page.
 */

/** Stable `@id` anchors so nodes can reference each other in one graph. */
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

const absolute = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized.split('?')[0]}`;
};

/**
 * `GeneralContractor` is the most accurate schema.org subtype available for the
 * business. Opening hours are the schedule confirmed by the owner: Monâ€“Fri,
 * 08:00â€“17:00.
 */
export const buildOrganizationNode = (description: string, image: string) => ({
  '@type': ['GeneralContractor', 'LocalBusiness'],
  '@id': ORGANIZATION_ID,
  name: COMPANY_INFO.name,
  alternateName: COMPANY_INFO.shortName,
  slogan: COMPANY_INFO.sloganKinyarwanda,
  description,
  url: `${SITE_ORIGIN}/`,
  telephone: COMPANY_INFO.phoneDisplay,
  email: COMPANY_INFO.email,
  image,
  logo: `${SITE_ORIGIN}/assets/brand/icon-512.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kimironko',
    addressRegion: 'Kigali',
    addressCountry: 'RW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: COMPANY_INFO.mapCenter.lat,
    longitude: COMPANY_INFO.mapCenter.lng,
  },
  areaServed: {
    '@type': 'Country',
    name: COMPANY_INFO.country,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  availableLanguage: ['en', 'rw'],
  knowsLanguage: ['en', 'rw'],
});

/** Site-wide `WebSite` node, tied to the organization as publisher. */
export const buildWebsiteNode = (language: SupportedLanguage) => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_ORIGIN}/`,
  name: COMPANY_INFO.name,
  inLanguage: language,
  publisher: { '@id': ORGANIZATION_ID },
});

/** The active page, linked back to the website and organization. */
export const buildWebPageNode = (
  path: string,
  language: SupportedLanguage,
  title: string,
  description: string
) => ({
  '@type': 'WebPage',
  '@id': `${absolute(path)}#webpage`,
  url: absolute(path),
  name: title,
  description,
  inLanguage: language,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORGANIZATION_ID },
});

/** Breadcrumb trail for nested routes (children of the home page). */
export const buildBreadcrumbNode = (
  path: string,
  language: SupportedLanguage,
  crumbs: { name: string; path: string }[]
) => ({
  '@type': 'BreadcrumbList',
  '@id': `${absolute(path)}#breadcrumb`,
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `${absolute(crumb.path)}?lang=${language}`,
  })),
});

/** Catalog of the four real service divisions, offered by the organization. */
export const buildServiceListNode = (
  services: { name: string; description: string; path: string }[]
) => ({
  '@type': 'ItemList',
  '@id': `${SITE_ORIGIN}/services#servicelist`,
  name: 'Services',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      url: absolute(service.path),
      provider: { '@id': ORGANIZATION_ID },
    },
  })),
});

/**
 * `FAQPage` is emitted only from the same FAQ content that is visible on the
 * page, as required for eligibility. Callers pass the already-translated pairs.
 */
export const buildFaqNode = (faqs: { question: string; answer: string }[]) => ({
  '@type': 'FAQPage',
  '@id': `${SITE_ORIGIN}/faq#faqpage`,
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/** Ids of the four service divisions, for callers building the service list. */
export const SERVICE_IDS = SERVICES_DATA.map((service) => service.id);

/** Ids of the visible FAQ entries. */
export const FAQ_IDS = FAQS_DATA.map((faq) => faq.id);

