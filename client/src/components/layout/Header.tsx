import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Mail, Menu, Phone, X } from 'lucide-react';

import { COMPANY_INFO } from '../../data/company';
import { SERVICES_DATA } from '../../data/services';
import { LocalizedLink } from '../common/LocalizedLink';
import { PillButton } from '../common/PillButton';
import { ServiceMegaMenu } from './ServiceMegaMenu';
import { ServiceIcon } from '../common/ServiceIcon';
import { SocialLinks } from '../common/SocialLinks';
import { cn } from '../../utils/cn';
import { useCmsServices } from '../../hooks/useCmsServices';
import { groupServicesForMenu } from '../../data/serviceMenu';
import { contentValue, useCmsContent } from '../../hooks/useCmsContent';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [expandedMobileServiceGroup, setExpandedMobileServiceGroup] = useState('renovation');
  const location = useLocation();
  const { services: cmsServices } = useCmsServices();
  const companyContent = useCmsContent('company');
  const company = contentValue(companyContent?.find((record) => record.key === 'contact'));
  const phoneDisplay = typeof company.phoneDisplay === 'string' && company.phoneDisplay ? company.phoneDisplay : COMPANY_INFO.phoneDisplay;
  const phoneRaw = typeof company.phoneRaw === 'string' && company.phoneRaw ? company.phoneRaw : COMPANY_INFO.phoneRaw;
  const email = typeof company.email === 'string' && company.email ? company.email : COMPANY_INFO.email;
  const menuServices = cmsServices ?? SERVICES_DATA.map((service) => ({ slug: service.id, title: t(`services.items.${service.id}.title`) }));
  const serviceGroups = groupServicesForMenu(menuServices);

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'services', path: '/services' },
    { key: 'gallery', path: '/gallery' },
    { key: 'blog', path: '/blog' },
    { key: 'team', path: '/team' },
    { key: 'faq', path: '/faq' },
    { key: 'contact', path: '/contact' },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
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
    if (!mobileMenuOpen && !servicesOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setServicesOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, servicesOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-full border-b border-slate-100 bg-white shadow-sm">
      {/* Utility bar */}
      <div className="hidden border-b border-slate-100 bg-slate-50 py-2 text-xs xl:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4 xl:gap-6">
            <a
              href={`tel:${phoneRaw}`}
              className="flex shrink-0 items-center gap-1.5 font-semibold text-slate-800 transition-colors hover:text-brand-orange"
            >
              <Phone className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
              {phoneDisplay}
            </a>
            {email && <a
              href={`mailto:${email}`}
              className="hidden items-center gap-1.5 truncate text-slate-600 transition-colors hover:text-brand-orange xl:flex"
            >
              <Mail className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
              {email}
            </a>}
          </div>

          <p className="hidden items-center gap-2 text-[11px] font-semibold italic text-slate-700 xl:flex">
            {COMPANY_INFO.tagline}
          </p>

          <div className="flex shrink-0 items-center gap-4">
            <SocialLinks variant="light" className="gap-0.5" />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-2 sm:h-20 sm:gap-4">
          <LocalizedLink
            to="/"
            className="flex min-w-0 items-center gap-2 rounded-lg p-1 sm:gap-3"
            aria-label={COMPANY_INFO.name}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0e224e] p-1 shadow-sm ring-1 ring-amber-300 sm:h-14 sm:w-14">
              <img
                src="/assets/brand/niyoireme-header.png"
                alt={COMPANY_INFO.name}
                width={386}
                height={402}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="hidden min-w-0 flex-col sm:flex">
              <span className="truncate text-xs font-black uppercase tracking-wide text-brand-navy sm:text-sm">NIYO IREME UNIT LTD</span>
              <span className="truncate text-[9px] font-semibold uppercase tracking-wider text-slate-500">PRO FINISH • HOME RENOVATION</span>
            </span>
          </LocalizedLink>

          <nav
            aria-label={t('header.primaryNav')}
            className="hidden min-w-0 items-center gap-4 xl:flex xl:gap-5 2xl:gap-7"
          >
            {navLinks.map((link) => {
              const isServices = link.key === 'services';

              if (!isServices) {
                return (
                  <LocalizedLink
                    key={link.key}
                    to={link.path}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={cn(
                      'relative whitespace-nowrap py-2 text-sm font-semibold transition-colors',
                      isActive(link.path)
                        ? 'text-brand-orange after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:bg-brand-orange after:content-[""]'
                        : 'text-slate-700 hover:text-brand-orange'
                    )}
                  >
                    {t(`nav.${link.key}`)}
                  </LocalizedLink>
                );
              }

              return (
                <div key={link.key} className="relative">
                  <button
                    type="button"
                    onClick={() => setServicesOpen((open) => !open)}
                    aria-expanded={servicesOpen}
                    aria-controls="services-mega-menu"
                    aria-haspopup="menu"
                    aria-label={t('header.servicesMenu')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors text-slate-700 hover:text-brand-orange hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  >
                    {t(`nav.${link.key}`)}
                    <ChevronRight
                      className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-90')}
                      aria-hidden="true"
                    />
                  </button>

                  {servicesOpen ? (
                    <ServiceMegaMenu isOpen={true} onClose={() => setServicesOpen(false)} />
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden xl:block">
              <PillButton to="/quote" size="md">
                {t('header.cta')}
              </PillButton>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-slate-100 xl:hidden"
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
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-slate-100 bg-white px-4 pb-7 pt-4 shadow-xl sm:max-h-[calc(100dvh-5rem)] xl:hidden"
        >
          <nav aria-label={t('header.mobileNav')} className="flex flex-col gap-1">
            {navLinks.map((link) => {
              if (link.key !== 'services') {
                return (
                  <LocalizedLink
                    key={link.key}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors',
                      isActive(link.path)
                        ? 'bg-brand-orange/10 text-brand-orange'
                        : 'text-slate-800 hover:bg-slate-100'
                    )}
                  >
                    <span>{t(`nav.${link.key}`)}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </LocalizedLink>
                );
              }

              return (
                <div key={link.key} className="rounded-xl bg-slate-50 p-2">
                  <LocalizedLink
                    to={link.path}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-sm font-semibold transition-colors',
                      isActive(link.path)
                        ? 'bg-brand-orange/10 text-brand-orange'
                        : 'text-slate-800 hover:bg-white'
                    )}
                  >
                    <span>{t(`nav.${link.key}`)}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </LocalizedLink>

                  <div className="mt-2 space-y-1.5">
                    {serviceGroups.map((group) => {
                      const expanded = expandedMobileServiceGroup === group.id;
                      return <section key={group.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <button type="button" aria-expanded={expanded} onClick={() => setExpandedMobileServiceGroup(expanded ? '' : group.id)} className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-bold text-brand-navy hover:bg-slate-50">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange"><ServiceIcon name={group.iconName} className="h-4 w-4" /></span><span className="min-w-0 flex-1">{group.title}</span><span className="text-xs font-semibold text-slate-400">{group.services.length}</span><ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} aria-hidden="true" />
                        </button>
                        {expanded && <ul className="border-t border-slate-100 p-1.5">
                          {group.services.map((service) => <li key={service.slug}>
                            <LocalizedLink to={`/services/${service.slug}`} onClick={() => setMobileMenuOpen(false)} aria-current={location.pathname === `/services/${service.slug}` ? 'page' : undefined} className={`flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === `/services/${service.slug}` ? 'bg-brand-orange/10 text-brand-orange' : 'text-slate-700 hover:bg-slate-50 hover:text-brand-orange'}`}>
                              {service.title}
                            </LocalizedLink>
                          </li>)}
                        </ul>}
                      </section>;
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
            <PillButton to="/quote" fullWidth>
              {t('header.cta')}
            </PillButton>
            <a
              href={`tel:${phoneRaw}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200"
            >
              <Phone className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              {phoneDisplay}
            </a>

            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="min-w-0 flex-1 text-[11px] font-semibold italic text-slate-500">
                {COMPANY_INFO.tagline}
              </p>
              <SocialLinks variant="light" className="shrink-0 gap-0.5" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

