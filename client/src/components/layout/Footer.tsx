import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';

import { COMPANY_INFO, MAP_LINKS } from '../../data/company';
import { LocalizedLink } from '../common/LocalizedLink';
import { PillButton } from '../common/PillButton';
import { InstallAppButton } from '../common/InstallAppButton';
import { SocialLinks } from '../common/SocialLinks';
import { contentValue, useCmsContent } from '../../hooks/useCmsContent';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const footerContent = useCmsContent('footer');
  const companyContent = useCmsContent('company');
  const footer = contentValue(footerContent?.find((record) => record.key === 'footer'));
  const company = contentValue(companyContent?.find((record) => record.key === 'contact'));
  const footerText = (key: string, fallback: string) => typeof footer[key] === 'string' && footer[key] ? String(footer[key]) : fallback;
  const companyText = (key: string, fallback: string) => typeof company[key] === 'string' && company[key] ? String(company[key]) : fallback;
  const phoneDisplay = companyText('phoneDisplay', COMPANY_INFO.phoneDisplay);
  const phoneRaw = companyText('phoneRaw', COMPANY_INFO.phoneRaw);
  const phoneAltDisplay = companyText('phoneAltDisplay', COMPANY_INFO.phoneAltDisplay);
  const phoneAltRaw = companyText('phoneAltRaw', COMPANY_INFO.phoneAltRaw);
  const email = companyText('email', COMPANY_INFO.email);
  const location = companyText('location', COMPANY_INFO.location);

  const navigation = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'services', path: '/services' },
    { key: 'team', path: '/team' },
    { key: 'gallery', path: '/gallery' },
    { key: 'faq', path: '/faq' },
    { key: 'contact', path: '/contact' },
    { key: 'privacy', path: '/privacy' },
  ];

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
    t('whatsapp.defaultMessage')
  )}`;

  return (
    <footer className="w-full bg-white">
      {/* Closing band */}
      <section className="relative overflow-hidden bg-brand-navy py-14 text-white">
        <div className="absolute inset-0 bg-grid-pattern-dark" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-crane.svg')] opacity-20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/40"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <p className="font-heading text-2xl font-black italic sm:text-3xl">
                {footerText('closingTagline', COMPANY_INFO.closingTagline)}
              </p>
              <p className="mt-2 text-sm text-slate-300">{t('footer.closingSloganTranslation')}</p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-end">
              <PillButton to="/quote" size="md">
                {t('common.requestQuote')}
              </PillButton>
              <InstallAppButton />
            </div>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <section className="relative overflow-hidden bg-brand-navy-soft pt-14 pb-12 text-white">
        <div className="absolute inset-x-0 top-0 h-3 bg-hazard-stripes opacity-40" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                {t('footer.aboutTitle')}
              </h2>
              <span className="mt-4 inline-flex h-28 w-28 items-center justify-center rounded-2xl bg-[#0e224e] p-2 shadow-md ring-1 ring-amber-300">
                <img
                  src="/assets/brand/niyoireme-header.png"
                  alt={`${COMPANY_INFO.name} full logo`}
                  width={386}
                  height={402}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </span>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
                {footerText('description', t('meta.defaultDescription'))}
              </p>
              <p className="mt-5 rounded-xl border border-white/10 bg-brand-navy/60 p-3 text-xs font-semibold italic text-brand-orange">
                {COMPANY_INFO.tagline}
              </p>

              <div className="mt-6">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                  {t('footer.followUs')}
                </h2>
                <SocialLinks variant="dark" className="mt-3 gap-2" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="lg:col-span-3" aria-label={t('footer.navigation')}>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                {t('footer.navigation')}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                {navigation.map((link) => (
                  <li key={link.path}>
                    <LocalizedLink to={link.path} className="transition-colors hover:text-brand-orange">
                      {t(`nav.${link.key}`)}
                    </LocalizedLink>
                  </li>
                ))}
                <li>
                  <a
                    href="/admin/login"
                    className="flex items-center gap-2 transition-colors hover:text-brand-orange"
                  >
                    Admin
                  </a>
                </li>
              </ul>
            </nav>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                {t('footer.contact')}
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="flex items-start gap-2 transition-colors hover:text-brand-orange"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                    {phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${phoneAltRaw}`}
                    className="flex items-start gap-2 transition-colors hover:text-brand-orange"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                    {phoneAltDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 transition-colors hover:text-brand-orange"
                  >
                    <MessageSquare
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange"
                      aria-hidden="true"
                    />
                    {t('common.whatsapp')}
                  </a>
                </li>
                {email && <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-2 transition-colors hover:text-brand-orange"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                    {email}
                  </a>
                </li>}
                <li>
                  <a
                    href={MAP_LINKS.googleSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 transition-colors hover:text-brand-orange"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                    {location}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright bar */}
      <div className="bg-brand-orange px-4 py-3 text-xs font-medium text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LocalizedLink to="/privacy" className="underline transition-opacity hover:opacity-80">
              {t('nav.privacy')}
            </LocalizedLink>
            <span aria-hidden="true">|</span>
            <span>
              <Trans
                i18nKey="footer.developerCredit"
                values={{ name: COMPANY_INFO.developer.name }}
                components={{
                  dev: (
                    <a
                      href={COMPANY_INFO.developer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline transition-opacity hover:opacity-80"
                    />
                  ),
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

