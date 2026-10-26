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
import { useCmsServices } from '../hooks/useCmsServices';
import { useWhatsAppContacts } from '../hooks/useWhatsAppContacts';
import { WhatsAppInquiry } from '../components/common/WhatsAppInquiry';
import type { CmsService, WhatsAppContact } from '../types/cms';

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
  const { services: cmsServices } = useCmsServices();
  const contacts = useWhatsAppContacts();

  const cmsService = cmsServices?.find((item) => item.slug === serviceId);
  const service = SERVICES_DATA.find((item) => item.id === serviceId);
  const serviceTitle = cmsService?.title || (service ? t(`services.items.${service.id}.title`) : t('services.items.finishing.title'));

  const breadcrumbs = useMemo(
    () => [
      { name: t('nav.home'), path: '/' },
      { name: t('nav.services'), path: '/services' },
      ...(service ? [{ name: serviceTitle, path: `/services/${service.id}` }] : []),
    ],
    [t, service, serviceTitle]
  );

  useSeo({
    title: cmsService
      ? cmsService.seoTitle || `${serviceTitle} | NIYO IREME UNIT LTD`
      : service
      ? t('meta.routes.serviceDetails.title', { service: serviceTitle })
      : t('meta.routes.services.title'),
    description: cmsService
      ? cmsService.seoDescription || cmsService.overview
      : service
      ? t('meta.routes.serviceDetails.description', { service: serviceTitle })
      : t('meta.routes.services.title'),
    path: cmsService ? `/services/${cmsService.slug}` : service ? `/services/${service.id}` : '/services',
    noIndex: cmsServices ? !cmsService : !service,
    image: cmsService?.mainImage || service?.image,
    breadcrumbs: service || cmsService ? breadcrumbs : undefined,
  });

  if (cmsService) return <CmsServiceDetail service={cmsService} contacts={contacts} related={cmsServices || []} />;

  if (cmsServices) return <>
    <PageHero eyebrow="NIYO IREME UNIT LTD" title="Service not found" subtitle="This service may have been updated or is no longer available." compact />
    <section className="py-16 text-center"><PillButton to="/services">Browse services</PillButton></section>
  </>;

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

  // Equipment page ” show equipment cards with rental/purchase CTAs
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

  // Workforce page ” show recruitment cards instead of generic service division
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

const CmsServiceDetail: React.FC<{ service: CmsService; contacts: WhatsAppContact[]; related: CmsService[] }> = ({ service, contacts, related }) => {
  const fields: Array<[string, string[] | undefined]> = [
    ['What this service addresses', service.problems],
    ['Work included', service.includedWork],
    ['Materials and equipment', service.materials],
    ['How we work', service.workflow],
    ['What to expect', service.deliverables],
    ['Benefits', service.benefits],
    ['Ways to tailor the work', service.customization],
    ['What affects project cost', service.costFactors],
  ];
  const gallery = service.gallery?.length ? service.gallery : (service.mainImage ? [{ url: service.mainImage, alt: `${service.title} example` }] : []);
  return <>
    <PageHero eyebrow="NIYO IREME UNIT LTD • FINISHING WORKS & INTERIOR DESIGN" title={service.title} subtitle={service.overview} />
    <article className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-extrabold text-brand-navy">About this service</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-700">{service.description}</p>
        </div>
        {gallery.length > 0 && <section className="mt-10" aria-label={`${service.title} gallery`}>
          <h2 className="mb-4 font-heading text-xl font-bold text-brand-navy">Examples and related finishes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{gallery.slice(0, 10).map((image, index) => <figure key={`${image.url}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img src={image.url} alt={image.alt || `${service.title} example ${index + 1}`} width={720} height={480} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
            <figcaption className="px-3 py-2 text-xs text-slate-600">{image.alt || `${service.title} example ${index + 1}`}</figcaption>
          </figure>)}</div>
          <p className="mt-2 text-xs text-slate-500">Images illustrate the type of finish or work discussed; they are not a claim about a specific project unless identified by the company.</p>
        </section>}
        <div className="mt-12 grid gap-5 md:grid-cols-2">{fields.filter(([, values]) => values?.length).map(([heading, values]) => <section key={heading} className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-lg font-bold text-brand-navy">{heading}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{values?.map((value) => <li key={value} className="flex gap-2"><span className="text-brand-orange" aria-hidden="true">•</span><span>{value}</span></li>)}</ul>
        </section>)}</div>
        {(service.faqs?.length ?? 0) > 0 && <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="font-heading text-2xl font-extrabold text-brand-navy">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">{service.faqs?.map((faq) => <details key={faq.question} className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-semibold text-brand-navy">{faq.question}</summary><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{faq.answer}</p></details>)}</div>
        </section>}
        <section className="mt-12 rounded-3xl bg-brand-navy p-6 text-white sm:p-9">
          <h2 className="font-heading text-2xl font-extrabold">Discuss your project</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">Contact us to review the site, agree the scope and discuss available options. Cost and timing depend on the property and selected work.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3"><PillButton to="/quote">Request a quotation</PillButton><WhatsAppInquiry serviceName={service.title} contacts={contacts} /></div>
        </section>
        {related.filter((item) => item.slug !== service.slug).length > 0 && <section className="mt-12">
          <h2 className="font-heading text-2xl font-extrabold text-brand-navy">Related services</h2>
          <div className="mt-4 flex flex-wrap gap-3">{related.filter((item) => item.slug !== service.slug).slice(0, 6).map((item) => <LocalizedLink key={item.slug} to={`/services/${item.slug}`} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:border-brand-orange">{item.title}</LocalizedLink>)}</div>
        </section>}
      </div>
    </article>
  </>;
};

