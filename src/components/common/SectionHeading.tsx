import React from 'react';

import { cn } from '../../utils/cn';

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className,
}) => {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'mb-12',
        isCentered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl',
        className
      )}
    >
      {badge ? (
        <div className={cn('inline-flex items-center gap-2 mb-3', isCentered && 'justify-center')}>
          <span className="w-6 h-[2px] bg-brand-orange" aria-hidden="true" />
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-wider',
              dark ? 'text-brand-orange' : 'text-slate-700'
            )}
          >
            {badge}
          </span>
        </div>
      ) : null}

      <h2
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-balance',
          dark ? 'text-white' : 'text-slate-900'
        )}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          className={cn(
            'mt-4 text-base md:text-lg leading-relaxed text-pretty',
            dark ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};
