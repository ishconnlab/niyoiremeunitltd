import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Mail, Menu, Phone, X } from 'lucide-react';

import { COMPANY_INFO } from '../../data/company';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { LocalizedLink } from '../common/LocalizedLink';
import { PillButton } from '../common/PillButton';
import { SocialLinks } from '../common/SocialLinks';
import { cn } from '../../utils/cn';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  /** FAQ is intentionally not part of the primary navigation — it lives in the
   *  pre-footer button band so the main menu stays short and scannable. */
  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'services', path: '/services' },
    { key: 'team', path: '/team' },
    { key: 'gallery', path: '/gallery' },
    { key: 'contact', path: '/contact' },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-100">
      {/* Utility bar */}
      <div className="hidden border-b border-slate-100 bg-slate-50 py-2 text-xs lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4 xl:gap-6">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="flex shrink-0 items-center gap-1.5 font-semibold text-slate-800 transition-colors hover:text-brand-orange"
            >
              <Phone className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden items-center gap-1.5 truncate text-slate-600 transition-colors hover:text-brand-orange xl:flex"
            >
              <Mail className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
              {COMPANY_INFO.email}
            </a>
          </div>

          <p className="hidden items-center gap-2 text-[11px] font-semibold italic text-slate-700 xl:flex">
            {COMPANY_INFO.sloganKinyarwanda}
          </p>

          <div className="flex shrink-0 items-center gap-4 xl:gap-5">
            <SocialLinks variant="light" className="gap-0.5" />
            <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
            <LanguageSwitcher variant="segmented" />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-4">
          <LocalizedLink
            to="/"
            className="flex min-w-0 items-center gap-2 rounded-lg p-1 sm:gap-3"
            aria-label={COMPANY_INFO.name}
          >
            <img
              src="/assets/brand/logo-horizontal.svg"
              alt={COMPANY_INFO.name}
              width={640}
              height={120}
              className="h-9 w-auto max-w-[46vw] object-contain sm:h-12 sm:max-w-none"
            />
          </LocalizedLink>

          <nav
            aria-label={t('header.primaryNav')}
            className="hidden items-center gap-4 lg:flex lg:gap-5 xl:gap-8"
          >
            {navLinks.map((link) => (
              <LocalizedLink
                key={link.key}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={cn(
                  'relative py-2 text-sm font-semibold transition-colors',
                  isActive(link.path)
                    ? 'text-brand-orange after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:bg-brand-orange after:content-[""]'
                    : 'text-slate-700 hover:text-brand-orange'
                )}
              >
                {t(`nav.${link.key}`)}
              </LocalizedLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="lg:hidden">
              <LanguageSwitcher variant="compact" />
            </div>

            <PillButton to="/quote" className="hidden xl:inline-flex" size="md">
              {t('header.cta')}
            </PillButton>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-slate-100 bg-white px-4 pb-7 pt-4 shadow-xl lg:hidden"
        >
          <nav aria-label={t('header.mobileNav')} className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <LocalizedLink
                key={link.key}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors',
                  isActive(link.path)
                    ? 'bg-brand-orange/10 text-brand-orange'
                    : 'text-slate-800 hover:bg-slate-100'
                )}
              >
                <span>{t(`nav.${link.key}`)}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </LocalizedLink>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
            <PillButton to="/quote" fullWidth>
              {t('header.cta')}
            </PillButton>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200"
            >
              <Phone className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>

            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="min-w-0 flex-1 truncate text-[11px] font-semibold italic text-slate-500">
                {COMPANY_INFO.sloganKinyarwanda}
              </p>
              <SocialLinks variant="light" className="shrink-0 gap-0.5" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};
