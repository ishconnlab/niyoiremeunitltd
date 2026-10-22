import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

import { COMPANY_INFO, OFFICIAL_SLOGAN_EN } from '../data/company';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { PillButton } from '../components/common/PillButton';
import { asArray } from '../utils/i18n';

export const About: React.FC = () => {
  const { t } = useTranslation();

  useSeo({
    title: t('meta.routes.about.title'),
    description: t('meta.routes.about.description'),
    path: '/about',
  });

  return (
    <>
      <PageHero
        eyebrow={t('about.hero.eyebrow')}
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        image="/assets/brand/og-image.png"
      />

      {/* Story */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <SectionHeading
                align="left"
                badge={t('about.story.eyebrow')}
                title={t('about.story.title')}
              />
              <p className="text-base leading-relaxed text-slate-600">{t('about.story.body1')}</p>
              <p className="mt-5 text-base leading-relaxed text-slate-600">{t('about.story.body2')}</p>
              <p className="mt-5 border-l-4 border-brand-orange bg-slate-50 p-5 text-base leading-relaxed text-slate-700">
                {t('about.story.body3')}
              </p>
            </div>

            <aside className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('about.story.locationLabel')}
                </p>
                <p className="mt-3 flex items-start gap-2 font-heading text-lg font-black text-brand-navy">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-orange" aria-hidden="true" />
                  {t('about.story.locationValue')}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {t('contact.addressNote')}
                </p>
                <PillButton to="/contact" className="mt-6" variant="outline" fullWidth>
                  {t('common.contactUs')}
                </PillButton>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-slate-100 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={t('about.values.eyebrow')}
            title={t('about.values.title')}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {asArray<{ title: string; body: string }>(
              t('about.values.items', { returnObjects: true })
            ).map((item, index) => (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-colors duration-300 hover:border-brand-navy/25"
              >
                <span
                  className="font-heading text-4xl font-black text-brand-orange/25"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-heading text-lg font-black text-brand-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Slogan band */}
      <section className="relative overflow-hidden bg-brand-navy py-16 text-white">
        <div
          className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-siteplan.svg')] opacity-25"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-heading text-2xl font-black italic sm:text-3xl">
            {COMPANY_INFO.sloganKinyarwanda}
          </p>
          <p className="mt-3 text-slate-300">{OFFICIAL_SLOGAN_EN}</p>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton to="/quote">{t('common.requestQuote')}</PillButton>
            <PillButton to="/services" variant="outline">
              {t('common.backToServices')}
            </PillButton>
          </div>
        </div>
      </section>
    </>
  );
};
