import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { SOCIAL_LINKS, WHATSAPP_LINK, type SocialChannel, type SocialLink } from '../../data/social';
import { WhatsAppIcon } from './WhatsAppIcon';
import { cn } from '../../utils/cn';
import { contentValue, useCmsContent } from '../../hooks/useCmsContent';

const ICONS: Record<SocialChannel, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: Twitter,
  whatsapp: WhatsAppIcon,
};

interface SocialLinksProps {
  /** `light` for the white utility bar, `dark` for navy surfaces. */
  variant?: 'light' | 'dark';
  /** Include WhatsApp next to the configured profiles. */
  includeWhatsApp?: boolean;
  className?: string;
}

/**
 * Social channel links for the top navigation and the mobile drawer.
 *
 * Only channels configured in the environment are rendered, so the header
 * never shows a dead or invented profile.
 */
export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'light',
  includeWhatsApp = true,
  className,
}) => {
  const { t } = useTranslation();
  const cmsSocial = useCmsContent('social');

  const cmsLinks = (cmsSocial || []).flatMap((record): SocialLink[] => {
    const channel = record.key as SocialChannel;
    if (!['facebook', 'instagram', 'youtube', 'x'].includes(channel)) return [];
    const value = contentValue(record);
    const url = typeof value.url === 'string' ? value.url.trim() : typeof record.value === 'string' ? record.value.trim() : '';
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return [];
    } catch { return []; }
    return [{ channel, labelKey: `social.${channel}`, url }];
  });
  const profileLinks = cmsSocial?.length ? cmsLinks : SOCIAL_LINKS;
  const links: SocialLink[] = includeWhatsApp ? [...profileLinks, WHATSAPP_LINK] : profileLinks;

  if (links.length === 0) return null;

  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {links.map((link) => {
        const Icon = ICONS[link.channel];
        const label = t(link.labelKey);

        return (
          <li key={link.channel}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                variant === 'light'
                  ? 'border-slate-200 bg-white text-slate-600 hover:border-brand-orange hover:text-brand-orange'
                  : 'border-white/15 bg-white/5 text-slate-200 hover:border-brand-orange hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

