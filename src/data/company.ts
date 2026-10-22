/**
 * Canonical, non-translatable company facts.
 *
 * Everything here is either an official brand string (name, slogans), a verified
 * contact detail, or a stable identifier used across the app. All other copy
 * lives in `src/i18n/locales/*`.
 */

/** Contact email is configurable until the company confirms its official address. */
const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL || 'info@niyoireme.rw';

export const COMPANY_INFO = {
  name: 'NIYO IREME UNIT COMPANY LTD',
  shortName: 'NIYO IREME',
  /** Official Kinyarwanda slogan — never translated. */
  sloganKinyarwanda: "Ubwiza, Ubunyamwuga n'Ireme mu Mirimo Yacu!",
  /** Official Kinyarwanda introductory statement — never translated. */
  introKinyarwanda: 'Dutanga serivisi zigezweho kandi zinoze aho waba uri hose.',
  /** Official Kinyarwanda closing slogan — never translated. */
  closingSloganKinyarwanda: "Ubwiza bw'inzu yawe ni intego yacu!",
  /** Neighbourhood-level location. No street address is claimed until confirmed. */
  location: 'Kimironko, Kigali, Rwanda',
  locationRegion: 'Kigali, Rwanda',
  country: 'Rwanda',
  phoneDisplay: '+250 781 294 928',
  phoneRaw: '+250781294928',
  whatsappNumber: '250781294928',
  email: CONTACT_EMAIL,
  /** Public site origin. Falls back to a localhost origin during development. */
  siteUrl: env.VITE_SITE_URL || 'http://localhost:3000',
  /** Map pin for the company premises in Kimironko, Kigali (client supplied). */
  mapCenter: { lat: -1.9509, lng: 30.1231 },
  mapZoom: 16,
  developer: {
    name: 'IshConnect',
    website: 'https://www.ishconnct.rw/',
  },
} as const;

export const MAP_LINKS = {
  googleSearch: 'https://www.google.com/maps/search/?api=1&query=-1.9509%2C30.1231',
  googleDirections: 'https://www.google.com/maps/dir/?api=1&destination=-1.9509%2C30.1231',
  openStreetMap: 'https://www.openstreetmap.org/?mlat=-1.9509&mlon=30.1231#map=16/-1.9509/30.1231',
} as const;

export const SERVICE_CATEGORY_IDS = ['finishing', 'painting', 'construction', 'workforce'] as const;

export const OFFICIAL_SLOGAN_EN = 'Beauty, Professionalism, and Quality in Everything We Build!';
export const OFFICIAL_INTRO_EN = 'We provide modern, high-quality services wherever you are.';
export const OFFICIAL_CLOSING_EN = 'The beauty of your home is our goal!';
