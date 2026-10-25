import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

import { LocalizedLink } from './LocalizedLink';

interface CircularTouchBadgeProps {
  className?: string;
  to?: string;
}

/** Rotating circular "get in touch" badge ” original site ornament. */
export const CircularTouchBadge: React.FC<CircularTouchBadgeProps> = ({
  className = '',
  to = '/quote',
}) => {
  const { t } = useTranslation();
  const label = t('common.getInTouch');

  return (
    <LocalizedLink
      to={to}
      className={`group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-navy border-2 border-slate-700 shadow-lg flex items-center justify-center transition-colors hover:border-brand-orange/60 hover:bg-brand-navy-soft ${className}`}
      aria-label={label}
    >
      {/* Background hatched rib texture */}
      <div className="absolute inset-0 rounded-full bg-hazard-stripes opacity-30" />

      {/* SVG Circular Text */}
      <svg
        className="w-full h-full animate-[spin_16s_linear_infinite] select-none pointer-events-none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          id="textCircle"
          d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          fill="none"
        />
        <text className="text-[7.5px] font-black uppercase tracking-[2.5px] fill-slate-300">
          <textPath href="#textCircle" startOffset="0%">
            {`${label.toUpperCase()} • ${label.toUpperCase()} • `}
          </textPath>
        </text>
      </svg>

      {/* Center Orange Button */}
      <div className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-orange group-hover:bg-brand-orange-dark text-white flex items-center justify-center shadow-md transition-colors">
        <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </LocalizedLink>
  );
};

