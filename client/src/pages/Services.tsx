import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useCmsServices } from '../hooks/useCmsServices';
import { useWhatsAppContacts } from '../hooks/useWhatsAppContacts';
import { SERVICES_DATA } from '../data/services';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { WhatsAppInquiry } from '../components/common/WhatsAppInquiry';
import type { CmsService } from '../types/cms';

export const Services: React.FC = () => {
  const { t } = useTranslation();
  const { services, error } = useCmsServices();
  const contacts = useWhatsAppContacts();

  const fallback = useMemo<CmsService[]>(() => SERVICES_DATA.map((service, index) => ({
    slug: service.id,
    title: t(`services.items.${service.id}.title`),
    overview: t(`services.items.${service.id}.description`),
    description: t(`services.items.${service.id}.description`),
    mainImage: service.image,
    status: 'published',
    isActive: true,
    order: index,
  })), [t]);
  const catalogue = services ?? (error ? fallback : []);

  const serviceList = useMemo(() => catalogue.map((service) => ({
    name: service.title,
    description: service.overview,
    path: `/services/${service.slug}`,
  })), [catalogue]);

  useSeo({
    title: t('meta.routes.services.title'),
    description: t('meta.routes.services.description'),
    path: '/services',
    serviceList,
  });

  return <>
    <PageHero eyebrow="NIYO IREME UNIT LTD" title="Services for your home and project" subtitle="Renovation, construction, finishing and project support, planned around the scope you need." />
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!error && services === null ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading services">{[1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-3xl bg-slate-200" />)}</div> : catalogue.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-700">Service information is being updated. Contact us to discuss your project.</p> : <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalogue.map((service) => {
            const image = service.mainImage || service.gallery?.[0]?.url;
            return <article key={service.slug} className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
              {image ? <img src={image} alt={service.gallery?.[0]?.alt || `${service.title} example`} width={720} height={480} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" /> : <div className="flex aspect-[3/2] items-center justify-center bg-slate-100 text-sm text-slate-600">Service image coming soon</div>}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-heading text-xl font-extrabold text-brand-navy">{service.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{service.overview}</p>
                {(service.benefits?.length ?? 0) > 0 && <ul className="mt-4 space-y-1 text-sm text-slate-700">{service.benefits?.slice(0, 3).map((benefit) => <li key={benefit} className="flex gap-2"><span aria-hidden="true" className="font-bold text-brand-orange">•</span>{benefit}</li>)}</ul>}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <LocalizedLink to={`/services/${service.slug}`} className="inline-flex min-h-11 items-center gap-2 font-bold text-brand-navy hover:text-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange">View details <ArrowRight className="h-4 w-4" aria-hidden="true" /></LocalizedLink>
                  <WhatsAppInquiry serviceName={service.title} contacts={contacts} />
                </div>
              </div>
            </article>;
          })}
        </div>}
      </div>
    </section>
  </>;
};
