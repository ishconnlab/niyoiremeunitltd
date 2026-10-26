import React from 'react';

import { cn } from '../../utils/cn';
import { useLocation } from 'react-router-dom';
import { contentValue, useCmsContent } from '../../hooks/useCmsContent';

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Optional background image. */
  image?: string;
  children?: React.ReactNode;
  className?: string;
  /** Renders a compact hero for secondary pages. */
  compact?: boolean;
}

/**
 * Shared page banner. Every inner page uses this so the visual rhythm and the
 * reading order stay consistent across the site.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  image,
  children,
  className,
  compact = false,
}) => {
  const { pathname } = useLocation();
  const section = pathname === '/services' ? 'services' : pathname.startsWith('/services/') ? 'serviceDetail' : pathname.slice(1).split('/')[0];
  const records = useCmsContent(section);
  const hero = contentValue(records?.find((record) => record.key === 'hero'));
  const displayEyebrow = typeof hero.eyebrow === 'string' && hero.eyebrow ? hero.eyebrow : eyebrow;
  const displayTitle = typeof hero.title === 'string' && hero.title ? hero.title : title;
  const displaySubtitle = typeof hero.subtitle === 'string' && hero.subtitle ? hero.subtitle : subtitle;

  return (
  <section
    className={cn(
      'relative overflow-hidden bg-brand-navy text-white',
      compact ? 'py-16 sm:py-20' : 'py-20 sm:py-24 lg:py-28',
      className
    )}
  >
    <div className="absolute inset-0 bg-grid-pattern-dark" aria-hidden="true" />
    <div
      className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-construction.svg')] opacity-20"
      aria-hidden="true"
    />

    {image ? (
      <>
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/60" aria-hidden="true" />
      </>
    ) : null}

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        {displayEyebrow ? (
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-brand-orange" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              {displayEyebrow}
            </span>
          </div>
        ) : null}

        <h1
          className={cn(
            'font-heading font-black tracking-tight leading-[1.08] text-balance',
            compact ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-4xl sm:text-5xl lg:text-6xl'
          )}
        >
          {displayTitle}
        </h1>

        {displaySubtitle ? (
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl text-pretty">
            {displaySubtitle}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  </section>
  );
};

