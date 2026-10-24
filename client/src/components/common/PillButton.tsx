import React from 'react';

import { LocalizedLink } from './LocalizedLink';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
type Size = 'sm' | 'md' | 'lg';

export interface PillButtonProps {
  children: React.ReactNode;
  /** Internal route. Renders a react-router `Link`. */
  to?: string;
  /** External URL. Renders an anchor. */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-orange text-white shadow-sm hover:bg-brand-orange-dark',
  dark: 'bg-brand-navy text-white shadow-sm hover:bg-brand-navy-soft',
  outline:
    'border border-brand-navy/20 bg-white text-brand-navy hover:border-brand-navy/40 hover:bg-slate-50',
  light: 'bg-white text-brand-navy shadow-sm hover:bg-slate-100',
  ghost: 'text-brand-navy hover:bg-slate-100',
};

/**
 * Sizes step up at `sm` (640px) and `lg` (1024px). The smallest tier keeps a
 * 40px touch height and tight padding so labels never overflow 320px screens,
 * while the largest tier grows to a 48px target on roomy viewports.
 */
const SIZES: Record<
  Size,
  { base: string; plain: string; withCircle: string; circle: string }
> = {
  sm: {
    base: 'min-h-10 gap-2 py-1.5 text-xs',
    plain: 'px-3.5 sm:px-4',
    withCircle: 'pl-3.5 pr-1.5 sm:pl-4',
    circle: 'h-7 w-7',
  },
  md: {
    base: 'min-h-11 gap-2 py-2 text-sm sm:min-h-12 sm:gap-2.5',
    plain: 'px-4 sm:px-5',
    withCircle: 'pl-4 pr-1.5 sm:pl-5',
    circle: 'h-8 w-8 sm:h-9 sm:w-9',
  },
  lg: {
    base: 'min-h-11 gap-2.5 py-2.5 text-sm sm:min-h-12 sm:gap-3 sm:text-base',
    plain: 'px-5 sm:px-6',
    withCircle: 'pl-5 pr-2 sm:pl-6',
    circle: 'h-8 w-8 sm:h-9 sm:w-9',
  },
};

const ICON_CIRCLE_VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-navy text-white',
  dark: 'bg-brand-orange text-white',
  outline: 'bg-brand-navy text-white',
  light: 'bg-brand-navy text-white',
  ghost: 'bg-brand-navy text-white',
};

const BASE =
  'group relative inline-flex items-center justify-center rounded-full font-bold tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className,
  disabled,
  fullWidth,
  ariaLabel,
  ariaExpanded,
  ariaControls,
}) => {
  const sizing = SIZES[size];
  const hasCircleIcon = Boolean(icon) && iconPosition === 'right';
  const classes = cn(
    BASE,
    VARIANTS[variant],
    sizing.base,
    hasCircleIcon ? sizing.withCircle : sizing.plain,
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {icon && iconPosition === 'left' ? (
        <span
          aria-hidden="true"
          className="relative shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          {icon}
        </span>
      ) : null}
      <span className="relative">{children}</span>
      {hasCircleIcon ? (
        <span
          aria-hidden="true"
          className={cn(
            'relative ml-1 flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5',
            sizing.circle,
            ICON_CIRCLE_VARIANTS[variant]
          )}
        >
          {icon}
        </span>
      ) : icon && iconPosition === 'right' ? (
        <span
          aria-hidden="true"
          className="relative shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        >
          {icon}
        </span>
      ) : null}
    </>
  );

  if (to) {
    return (
      <LocalizedLink
        to={to}
        className={classes}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
      >
        {content}
      </LocalizedLink>
    );
  }

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {content}
    </button>
  );
};

