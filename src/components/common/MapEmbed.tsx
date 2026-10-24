import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

import { COMPANY_INFO, MAP_LINKS } from '../../data/company';
import { PillButton } from './PillButton';

/** Bounding box around the company premises pin in Kimironko, Kigali. */
const BBOX = '30.1163,-1.9569,30.1299,-1.9449';
const EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
  BBOX
)}&layer=mapnik&marker=${encodeURIComponent(`${COMPANY_INFO.mapCenter.lat},${COMPANY_INFO.mapCenter.lng}`)}`;

export interface MapEmbedProps {
  title?: string;
  note?: string;
  className?: string;
}

/**
 * Map of the company premises in Kimironko, Kigali.
 * The marker shows the premises pin; the exact meeting point is confirmed when
 * a site visit is scheduled.
 */
export const MapEmbed: React.FC<MapEmbedProps> = ({ title, note, className }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
        <iframe
          src={EMBED_URL}
          title={title ?? t('contact.mapTitle')}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[320px] sm:h-[420px] w-full border-0"
        />

        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-brand-navy shadow-md">
          <MapPin className="w-4 h-4 text-brand-orange" aria-hidden="true" />
          <span>{COMPANY_INFO.location}</span>
        </div>
      </div>

      {note ? <p className="mt-4 text-sm text-slate-600 leading-relaxed">{note}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PillButton
          href={MAP_LINKS.googleSearch}
          variant="outline"
          icon={<ExternalLink className="w-4 h-4" />}
          iconPosition="right"
        >
          {t('contact.viewOnGoogleMaps')}
        </PillButton>
        <PillButton
          href={MAP_LINKS.googleDirections}
          variant="primary"
          icon={<Navigation className="w-4 h-4" />}
          iconPosition="left"
        >
          {t('contact.getDirections')}
        </PillButton>
        <PillButton
          href={MAP_LINKS.openStreetMap}
          variant="ghost"
          icon={<MapPin className="w-4 h-4" />}
          iconPosition="left"
        >
          {t('contact.openInMaps')}
        </PillButton>
      </div>
    </div>
  );
};

