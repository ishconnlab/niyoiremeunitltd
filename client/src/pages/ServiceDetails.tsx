import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Users, Wrench } from 'lucide-react';

import { COMPANY_INFO } from '../data/company';
import { SERVICES_DATA } from '../data/services';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { ServiceIcon } from '../components/common/ServiceIcon';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { asArray } from '../utils/i18n';

type EquipmentItem = {
  title: string;
  body: string;
  use?: string;
  action: 'rental' | 'purchase' | 'both';
  icon: React.ElementType;
  image: string;
};

const EQUIPMENT_ITEMS: EquipmentItem[] = [
  {
    title: 'Earthmoving and site preparation',
    body: 'Available equipment for site preparation, excavation and moving materials, subject to confirmation for your project.',
    use: 'Excavation, site clearing and material movement for building sites.',
    action: 'rental',
    icon: Wrench,
    image: '/projects/construction-renovation.jpg',
  },
  {
    title: 'Concrete and blockwork',
    body: 'Mixers, compactors and related equipment for concrete, blockwork and structural work.',
    use: 'Mixing, compacting and finishing concrete and blockwork.',
    action: 'rental',
    icon: Wrench,
    image: '/projects/construction-renovation.jpg',
  },
  {
    title: 'Finishing and surface tools',
    body: 'Equipment for surface preparation, grinding, polishing and finishing work.',
    use: 'Surface preparation, grinding, polishing and surface finishing.',
    action: 'rental',
    icon: Wrench,
    image: '/projects/interior-finishing.jpg',
  },
  {
    title: 'Cleaning and site care',
    body: 'Pressure washers and clean-up equipment for post-renovation and handover cleaning.',
    use: 'Pressure washing and post-construction site clean-up.',
    action: 'rental',
    icon: Wrench,
    image: '/projects/interior-finishing-detail.jpg',
  },
  {
    title: 'Measuring and quality checks',
    body: 'Levelling, measuring and inspection tools used to check accuracy on site.',
    use: 'Levelling, measuring and inspection for accuracy checks.',
    action: 'rental',
    icon: Wrench,
    image: '/projects/technical-drawing.jpg',
  },
  {
    title: 'Safety and site support',
    body: 'Safety equipment and site support items for the agreed scope of work.',
    use: 'PPE and site support items for safe work.',
    action: 'rental',
    icon: Wrench,
    image: '/projects/construction-renovation.jpg',
  },
  {
    title: 'Building materials sales',
    body: 'We sell available building materials and finishing supplies, and help you choose the right products for your site.',
    use: 'Paint, tools, adhesives and finishing supplies for construction and finishing projects.',
    action: 'purchase',
    icon: Wrench,
    image: '/projects/construction-renovation.jpg',
  },
];

type RecruitItem = {
  title: string;
  body: string;
  cta: string;
  ctaKey: string;
  messageKey: string;
  params?: Record<string, string>;
};

const RECRUIT_ITEMS: RecruitItem[] = [
  {
    title: 'Request Workers',
    body: 'We help employers find skilled and experienced workers for construction, finishing and renovation sites.',
    ctaKey: 'workforce.ctaRequestWorkers',
    messageKey: 'whatsapp.workforceRequestWorkers',
    params: { workType: 'construction, finishing and renovation' },
    cta: '',
  },
  {
    title: 'Ask About Job Opportunities',
    body: 'We connect skilled workers with employers across Kigali and Rwanda. Ask about available roles and how to apply.',
    ctaKey: 'workforce.ctaJobInquiry',
    messageKey: 'whatsapp.workforceJobInquiry',
    cta: '',
  },
];

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
      : t('meta.routes.services.title'),
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

  const whatsappUrl = (messageKey: string, params: Record<string, string>) => {
    const text = t(messageKey, params);
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  // Equipment page â€” show equipment cards with rental/purchase CTAs
  if (serviceId === 'equipment') {
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EQUIPMENT_ITEMS.map((item) => {
                const isRental = item.action === 'rental' || item.action === 'both';
                const isPurchase = item.action === 'purchase' || item.action === 'both';
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-0 shadow-sm hover:border-brand-navy/10 transition-colors flex flex-col min-h-[340px] overflow-hidden"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange mb-3 shrink-0">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-heading text-lg font-black text-brand-navy mb-2">
                        {item.title}
                      </h3>
                      {item.use ? (
                        <p className="mb-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {item.use}
                        </p>
                      ) : null}
                      <p className="mb-4 text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
                        {item.body}
                      </p>
                      <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {isRental && (
                          <PillButton
                            href={whatsappUrl('whatsapp.equipmentRental', { name: item.title })}
                            size="sm"
                            variant="primary"
                            className="text-xs sm:text-sm w-full sm:w-auto"
                          >
                            {t('equipment.ctaRental')}
                          </PillButton>
                        )}
                        {isPurchase && (
                          <PillButton
                            href={whatsappUrl('whatsapp.equipmentPurchase', { name: item.title })}
                            size="sm"
                            variant="outline"
                            className="text-xs sm:text-sm w-full sm:w-auto border-brand-navy/20 hover:border-brand-orange"
                          >
                            {t('equipment.ctaPurchase')}
                          </PillButton>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading text-xl font-black text-brand-navy mb-3">
                {t('services.detail.scopeTitle')}
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                {asArray<string>(
                  t(`services.items.${service.id}.points`, { returnObjects: true })
                ).map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
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
  }

  // Workforce page â€” show recruitment cards instead of generic service division
  if (serviceId === 'workforce') {
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
            <div className="grid gap-6 sm:grid-cols-2">
              {RECRUIT_ITEMS.map((item) => {
                const url = whatsappUrl(item.messageKey, item.params || {});
                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col min-h-[280px]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange mb-4 shrink-0">
                      <Users className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-black text-brand-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="mb-6 text-sm text-slate-600 leading-relaxed flex-1">
                      {item.body}
                    </p>
                    <PillButton
                      href={url}
                      size="md"
                      variant="primary"
                      fullWidth
                    >
                      {t(item.ctaKey)}
                    </PillButton>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading text-xl font-black text-brand-navy mb-3">
                {t('services.detail.scopeTitle')}
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                {asArray<string>(
                  t(`services.items.${service.id}.points`, { returnObjects: true })
                ).map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
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
  }

  // Default service details layout for all other services
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

