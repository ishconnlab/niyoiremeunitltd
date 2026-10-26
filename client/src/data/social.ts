import { COMPANY_INFO } from './company';

/**
 * Social channels.
 *
 * Each profile URL is configured with an environment variable so the company
 * can switch accounts without code changes. A channel is only rendered when a
 * URL is provided ” the site never links to an account that does not exist.
 */
export type SocialChannel = 'facebook' | 'instagram' | 'youtube' | 'x' | 'whatsapp';

export interface SocialLink {
  channel: SocialChannel;
  /** Accessible name, kept in the locale files (`social.<channel>`). */
  labelKey: string;
  url: string;
}

const env = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const viteEnv = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

/**
 * Channels without a confirmed profile are omitted. Avoid publishing a guessed
 * or placeholder destination as a company social account.
 */
const social = (channel: SocialChannel, labelKey: string, value: unknown): SocialLink => ({
  channel,
  labelKey,
  url: env(value),
});

const CONFIGURED_SOCIAL_LINKS: SocialLink[] = [
  social('facebook', 'social.facebook', viteEnv.VITE_FACEBOOK_URL),
  social('instagram', 'social.instagram', viteEnv.VITE_INSTAGRAM_URL),
  social('youtube', 'social.youtube', viteEnv.VITE_YOUTUBE_URL),
  social('x', 'social.x', viteEnv.VITE_X_URL),
];

export const SOCIAL_LINKS: SocialLink[] = CONFIGURED_SOCIAL_LINKS.filter((link) => Boolean(link.url));

/** WhatsApp is always available ” it is the channel the company answers on. */
export const WHATSAPP_LINK: SocialLink = {
  channel: 'whatsapp',
  labelKey: 'social.whatsapp',
  url: `https://wa.me/${COMPANY_INFO.whatsappNumber}`,
};

