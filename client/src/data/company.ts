/**
 * Canonical, non-translatable company facts.
 *
 * Everything here is either an official brand string (name, slogans), a verified
 * contact detail, or a stable identifier used across the app. All other copy
 * lives in `src/i18n/locales/*`.
 */

/** Contact email is configurable until the company confirms its official address. */
const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL || '';

export const COMPANY_INFO = {
  name: 'NIYO IREME UNIT LTD',
  shortName: 'NIYO IREME UNIT LTD',
  registeredName: 'NIYO IREME UNIT COMPANY LTD',
  tagline: 'Quality. Precision. Excellence.',
  intro: "Your home's beauty and quality are our priority.",
  closingTagline: 'Quality. Precision. Excellence.',
  /** Neighbourhood-level location. No street address is claimed until confirmed. */
  location: 'Kimironko, Kigali, Rwanda',
  locationRegion: 'Kigali, Rwanda',
  country: 'Rwanda',
  phoneDisplay: '+250 781 294 928',
  phoneRaw: '+250781294928',
  whatsappNumber: '250781294928',
  email: CONTACT_EMAIL,
  /** Public site origin. Falls back to the official production domain. */
  siteUrl: env.VITE_SITE_URL || 'https://niyoiremeunitltd.vercel.app',
  /** Map pin for the company premises in Kimironko, Kigali (client supplied). */
  mapCenter: { lat: -1.9509, lng: 30.1231 },
  mapZoom: 16,
  developer: {
    name: 'IshConnect',
    website: 'https://ishconnct.com/',
  },
} as const;

export const MAP_LINKS = {
  googleSearch: 'https://www.google.com/maps/search/?api=1&query=-1.9509%2C30.1231',
  googleDirections: 'https://www.google.com/maps/dir/?api=1&destination=-1.9509%2C30.1231',
  openStreetMap: 'https://www.openstreetmap.org/?mlat=-1.9509&mlon=30.1231#map=16/-1.9509/30.1231',
} as const;

export const SERVICE_CATEGORY_IDS = ['finishing', 'painting', 'construction', 'workforce'] as const;

export const OFFICIAL_SLOGAN_EN = 'Quality. Precision. Excellence.';
export const OFFICIAL_INTRO_EN = "Your home's beauty and quality are our priority.";
export const OFFICIAL_CLOSING_EN = 'Quality. Precision. Excellence.';

