import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check } from 'lucide-react';

import { SERVICES_DATA } from '../data/services';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { ServiceIcon } from '../components/common/ServiceIcon';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { asArray } from '../utils/i18n';

export const ServiceDetails: React.FC = () => {
  const { t } = useTranslation();
  const { serviceId } = useParams<{ serviceId: string }>();

  const service = SERVICES_DATA.find((item) => item.id === serviceId);
  const serviceTitle = service ? t(`services.items.${service.id}.title`) : t('services.items.finishing.title');

  const breadcrumbs = useMemo(
    () => [
      { name: t('nav.home'), path: '/' },
      { name: t('nav.services'), path: '/services' },
      ...(service ? [{ name: serviceTitle, path: `/services/${service.id}` }] : []),
    ],
    [t, service, serviceTitle]
  );

  useSeo({
    title: service
      ? t('meta.routes.serviceDetails.title', { service: serviceTitle })
      : t('meta.routes.services.title'),
    description: service
      ? t('meta.routes.serviceDetails.description', { service: serviceTitle })
      : t('meta.routes.services.description'),
    path: service ? `/services/${service.id}` : '/services',
    noIndex: !service,
    image: service?.image,
    breadcrumbs: service ? breadcrumbs : undefined,
  });

  if (!service) {
    return (
      <>
        <PageHero eyebrow={t('services.detail.eyebrow')} title={t('services.detail.notFoundTitle')} compact />
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-slate-600">{t('services.detail.notFoundBody')}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PillButton to="/services">{t('common.backToServices')}</PillButton>
              <PillButton to="/quote" variant="outline">
                {t('common.requestQuote')}
              </PillButton>
            </div>
          </div>
        </section>
      </>
    );
  }

  const otherServices = SERVICES_DATA.filter((item) => item.id !== service.id);

  return (
    <>
      <PageHero
        eyebrow={t('services.detail.eyebrow')}
        title={serviceTitle}
        subtitle={t(`services.items.${service.id}.description`)}
        image={service.image}
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange text-white">
                  <ServiceIcon name={service.iconName} className="h-6 w-6" />
                </span>
                <h2 className="font-heading text-2xl font-black text-brand-navy">
                  {t('services.detail.scopeTitle')}
                </h2>
              </div>

              <ul className="mt-8 space-y-4">
                {asArray<string>(
                  t(`services.items.${service.id}.points`, { returnObjects: true })
                ).map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-base leading-relaxed text-slate-700 shadow-sm"
                  >
                    <Check className="mt-1 h-5 w-5 shrink-0 text-brand-orange" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="font-heading text-xl font-black text-brand-navy">
                  {t('services.detail.ctaTitle')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {t('services.detail.ctaBody')}
                </p>
                <PillButton to="/quote" fullWidth className="mt-6">
                  {t('common.requestQuote')}
                </PillButton>
                <PillButton to="/contact" variant="outline" fullWidth className="mt-3">
                  {t('common.contactUs')}
                </PillButton>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black text-brand-navy">
            {t('services.detail.otherServices')}
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {otherServices.map((item) => (
              <LocalizedLink
                key={item.id}
                to={`/services/${item.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-brand-navy/25"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <ServiceIcon name={item.iconName} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-black text-brand-navy">
                  {t(`services.items.${item.id}.title`)}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange">
                  {t('common.viewDetails')}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
