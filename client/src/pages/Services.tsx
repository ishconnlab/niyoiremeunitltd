import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check } from 'lucide-react';

import { SERVICES_DATA } from '../data/services';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { ServiceIcon } from '../components/common/ServiceIcon';
import { ServiceMedia } from '../components/common/ServiceMedia';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { asArray } from '../utils/i18n';

export const Services: React.FC = () => {
  const { t } = useTranslation();

  const serviceList = useMemo(
    () =>
      SERVICES_DATA.map((service) => ({
        name: t(`services.items.${service.id}.title`),
        description: t(`services.items.${service.id}.description`),
        path: `/services/${service.id}`,
      })),
    [t]
  );

  const breadcrumbs = useMemo(
    () => [
      { name: t('nav.home'), path: '/' },
      { name: t('nav.services'), path: '/services' },
    ],
    [t]
  );

  useSeo({
    title: t('meta.routes.services.title'),
    description: t('meta.routes.services.description'),
    path: '/services',
    breadcrumbs,
    serviceList,
  });

  return (
    <>
      <PageHero
        eyebrow={t('services.hero.eyebrow')}
        title={t('services.hero.title')}
        subtitle={t('services.hero.subtitle')}
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {SERVICES_DATA.map((service, index) => (
              <article
                key={service.id}
                className="grid items-center gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>
                  <ServiceMedia
                    service={service}
                    imageClassName="h-64 w-full object-cover sm:h-72 lg:h-80"
                    fallbackClassName="flex h-64 w-full items-center justify-center bg-brand-navy bg-grid-pattern-dark sm:h-72 lg:h-80"
                    iconClassName="h-20 w-20 text-brand-orange"
                  />
                </div>

                <div className="p-7 lg:p-10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white">
                      <ServiceIcon name={service.iconName} className="h-5 w-5" />
                    </span>
                    <span className="font-heading text-sm font-black tracking-widest text-slate-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="mt-5 font-heading text-2xl font-black text-brand-navy sm:text-3xl">
                    {t(`services.items.${service.id}.title`)}
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {t(`services.items.${service.id}.description`)}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {asArray<string>(t(`services.items.${service.id}.points`, { returnObjects: true })).map(
                      (point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange"
                            aria-hidden="true"
                          />
                          {point}
                        </li>
                      )
                    )}
                  </ul>

                  <LocalizedLink
                    to={`/services/${service.id}`}
                    className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange-dark"
                  >
                    {t('common.viewDetails')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </LocalizedLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="relative overflow-hidden bg-brand-navy py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-grid-pattern-dark" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={t('services.whyChoose.eyebrow')}
            title={t('services.whyChoose.title')}
            dark
          />

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {asArray<{ title: string }>(t('services.whyChoose.items', { returnObjects: true })).map(
              (item, index) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
                >
                  <span
                    className="font-heading text-3xl font-black text-brand-orange/60"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 font-heading text-base font-bold leading-snug">{item.title}</p>
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* Consultation band */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black text-brand-navy sm:text-3xl">
            {t('services.consultBand.title')}
          </h2>
          <p className="mt-3 text-slate-600">{t('services.consultBand.body')}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton to="/contact">{t('services.consultBand.cta')}</PillButton>
            <PillButton to="/quote" variant="outline">
              {t('common.requestQuote')}
            </PillButton>
          </div>
        </div>
      </section>
    </>
  );
};

