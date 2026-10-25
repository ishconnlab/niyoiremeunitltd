import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Hammer,
  MapPin,
  Navigation,
  Phone,
  Play,
} from 'lucide-react';

import { COMPANY_INFO, OFFICIAL_INTRO_EN, MAP_LINKS } from '../data/company';
import { GALLERY_DATA } from '../data/gallery';
import { SERVICES_DATA } from '../data/services';
import { useSeo } from '../hooks/useSeo';
import { useLanguage } from '../hooks/useLanguage';
import { CircularTouchBadge } from '../components/common/CircularTouchBadge';
import { ClientFeedback } from '../components/common/ClientFeedback';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { RulerDivider } from '../components/common/RulerDivider';
import { SectionHeading } from '../components/common/SectionHeading';
import { ServiceIcon } from '../components/common/ServiceIcon';
import { ServiceMedia } from '../components/common/ServiceMedia';
import { EquipmentShowcase } from '../components/common/EquipmentShowcase';
import { asArray } from '../utils/i18n';

const PROCESS_ICONS = [ClipboardList, Hammer, CheckCircle2];

/**
 * Hero photography. Purely illustrative ” it shows the type of work the
 * company delivers, never a documented project.
 *
 * The hero cycles through a curated set of site photos so the band feels alive
 * without resorting to a video. The first frame is the LCP image and is loaded
 * eagerly; the rest are decoded lazily once the browser is idle.
 */
const HERO_SLIDES = [
  '/projects/construction-renovation.jpg',
  '/projects/interior-finishing.jpg',
  '/projects/painting-renovation.jpg',
  '/projects/gypsum-ceilings.jpg',
  '/projects/tile-installation-2.jpg',
  '/projects/interior-living-space.jpg',
  '/projects/glass-installation.jpg',
  '/projects/wall-plastering.jpg',
  '/projects/interior-finishing-detail.jpg',
  '/projects/painting-services.jpg',
];

const HERO_SLIDE_INTERVAL_MS = 4500;

const HeroSlideshow: React.FC<{ alt: string }> = ({ alt }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length < 2) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden={false}>
      {HERO_SLIDES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === 0 ? alt : ''}
          width={736}
          height={1097}
          className={`home-hero-slide absolute inset-0 h-full w-full object-cover ${
            index === active ? 'is-active' : ''
          }`}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={index === 0 ? 'high' : 'low'}
          aria-hidden={index === 0 ? undefined : true}
        />
      ))}
    </div>
  );
};

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { isKinyarwanda } = useLanguage();

  useSeo({
    title: t('meta.routes.home.title'),
    description: t('meta.routes.home.description'),
    path: '/',
  });

  const nativeIntro = isKinyarwanda ? COMPANY_INFO.introKinyarwanda : OFFICIAL_INTRO_EN;
  const translatedIntro = isKinyarwanda ? OFFICIAL_INTRO_EN : COMPANY_INFO.introKinyarwanda;

  const galleryPreview = GALLERY_DATA.slice(0, 5);
  const whyItems = asArray<{ title: string }>(
    t('services.whyChoose.items', { returnObjects: true })
  );

  return (
    <>
      {/* Hero ” editorial headline, service pills and a navy construction band
          carrying the site photography, slogan and headline figures. */}
      <section className="relative overflow-hidden bg-white pt-8">
        <RulerDivider className="absolute inset-x-0 top-0" />

        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="home-reveal max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2">
                <span className="h-[2px] w-6 bg-brand-orange" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t('home.hero.eyebrow')}
                </span>
              </div>

              <h1 className="font-heading text-4xl font-black leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                <span className="block text-brand-navy">{t('home.hero.titleTop')}</span>
                <span className="mt-1 block text-brand-orange">{t('home.hero.titleBottom')}</span>
              </h1>
            </div>

            <div className="mt-2 hidden shrink-0 lg:block">
              <CircularTouchBadge />
            </div>
          </div>

          <div className="mt-8 grid gap-8 pb-10 lg:grid-cols-12 lg:items-center">
            <div className="home-reveal home-reveal-1 lg:col-span-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <PillButton to="/quote" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                  {t('home.hero.ctaPrimary')}
                </PillButton>
                <PillButton
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  size="lg"
                  variant="outline"
                  icon={<Phone className="h-4 w-4" />}
                >
                  {t('home.hero.ctaSecondary', { phone: COMPANY_INFO.phoneDisplay })}
                </PillButton>
              </div>
            </div>

            <div className="home-reveal home-reveal-2 flex items-start gap-4 lg:col-span-5">
              <div className="mt-1 h-12 w-[3px] shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                  {t('home.hero.intro', { intro: nativeIntro })}
                </p>
                <p className="mt-2 text-xs italic leading-relaxed text-slate-400">
                  {t('home.hero.introTranslated', { introTranslated: translatedIntro })}
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy">
                  <MapPin className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
                  {COMPANY_INFO.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navy construction band */}
        <div className="relative overflow-hidden bg-brand-navy pb-16 pt-8">
          <div className="bg-hazard-stripes absolute inset-0 opacity-20" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              <div className="home-reveal relative lg:col-span-8 lg:h-full">
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-xl chamfer-tl lg:aspect-auto lg:h-full lg:min-h-[420px]">
                  <HeroSlideshow alt={t('home.hero.heroPhotoAlt')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <LocalizedLink
                    to="/gallery"
                    aria-label={t('home.hero.playLabel')}
                    className="group absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/25 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/35 sm:h-20 sm:w-20"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-orange shadow-md sm:h-12 sm:w-12">
                      <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                    </span>
                  </LocalizedLink>

                  <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto">
                    <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                      <span className="shrink-0 font-bold text-brand-orange">
                        {t('home.hero.sloganLabel')}:
                      </span>
                      <span className="truncate italic">{COMPANY_INFO.sloganKinyarwanda}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="home-reveal home-reveal-1 lg:col-span-4 lg:h-full">
                <div className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-brand-orange p-8 text-white shadow-xl sm:p-10">
                  {(
                    [
                      ['supervision', true],
                      ['artisans', true],
                      ['reach', false],
                    ] as const
                  ).map(([stat, bordered]) => (
                    <div key={stat} className={bordered ? 'border-white/20 pt-6 first:border-0 first:pt-0' : ''}>
                      <h3 className="font-heading text-4xl font-black tracking-tight sm:text-5xl">
                        {t(`home.hero.stats.${stat}Value`)}
                      </h3>
                      <p className="mt-1 text-sm font-semibold sm:text-base">
                        {t(`home.hero.stats.${stat}Label`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services ” editorial list rather than a wall of identical cards */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Services marquee ” a fast, never-ending strip of logo-styled
              service cards that replaces the static heading. */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-2">
              <span className="h-[2px] w-6 bg-brand-orange" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
                {t('home.services.eyebrow')}
              </span>
              <span className="h-[2px] w-6 bg-brand-orange" aria-hidden="true" />
            </div>
          </div>

          <div
            className="service-marquee mt-10 overflow-hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
          >
            <ul className="service-marquee-track flex w-max items-stretch gap-4">
              {[...SERVICES_DATA, ...SERVICES_DATA].map((service, index) => (
                <li key={`${service.id}-${index}`} className="shrink-0" aria-hidden={index >= SERVICES_DATA.length}>
                  <LocalizedLink
                    to={`/services/${service.id}`}
                    tabIndex={index >= SERVICES_DATA.length ? -1 : undefined}
                    className="group flex h-full w-60 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-colors hover:border-brand-orange/50 sm:w-72"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <ServiceMedia
                        service={service}
                        imageClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        fallbackClassName="flex h-full w-full items-center justify-center bg-brand-navy"
                        iconClassName="h-6 w-6 text-brand-orange"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-heading text-sm font-black text-brand-navy">
                        {t(`services.items.${service.id}.title`)}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
                        {t(`services.items.${service.id}.shortLabel`)}
                      </span>
                    </span>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {SERVICES_DATA.map((service, index) => {
              const flipped = index % 2 === 1;

              return (
                <article
                  key={service.id}
                  className="grid items-center gap-8 py-10 md:grid-cols-12 md:gap-10"
                >
                  <div
                    className={
                      flipped
                        ? 'md:col-span-5 md:order-2 md:pl-6'
                        : 'md:col-span-5 md:pr-6'
                    }
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <ServiceMedia
                        service={service}
                        imageClassName="h-56 w-full object-cover sm:h-64"
                        fallbackClassName="flex h-56 w-full items-center justify-center bg-brand-navy bg-grid-pattern-dark sm:h-64"
                        iconClassName="h-14 w-14 text-brand-orange"
                      />
                      <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange text-white">
                        <ServiceIcon name={service.iconName} className="h-5 w-5" />
                      </span>
                    </div>
                  </div>

                  <div className={flipped ? 'md:col-span-7 md:order-1' : 'md:col-span-7'}>
                    <p className="font-heading text-sm font-bold tracking-widest text-brand-orange">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-black text-brand-navy sm:text-3xl">
                      {t(`services.items.${service.id}.title`)}
                    </h3>
                    <p className="mt-3 max-w-xl leading-relaxed text-slate-600">
                      {t(`services.items.${service.id}.description`)}
                    </p>
                    <LocalizedLink
                      to={`/services/${service.id}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange-dark"
                    >
                      {t('common.viewDetails')}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </LocalizedLink>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10">
            <PillButton to="/services" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
              {t('home.services.cta')}
            </PillButton>
          </div>
        </div>
      </section>

      {/* Why choose us ” the company's own commitments, set as a statement */}
      <section className="relative overflow-hidden bg-brand-navy py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-grid-pattern-dark" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                align="left"
                badge={t('home.why.eyebrow')}
                title={t('home.why.title')}
                subtitle={t('home.why.subtitle')}
                dark
              />
            </div>

            <ol className="grid gap-6 lg:col-span-7 lg:grid-cols-2">
              {whyItems.map((item, index) => (
                <li key={item.title} className="flex gap-4 border-t border-white/15 pt-4">
                  <span
                    className="font-heading text-2xl font-black text-brand-orange/70"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-heading text-base font-bold leading-snug">{item.title}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Process ” a single timeline */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={t('home.process.eyebrow')}
            title={t('home.process.title')}
          />

          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <span
              className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 md:block"
              aria-hidden="true"
            />
            {asArray<{ title: string; body: string }>(
              t('home.process.steps', { returnObjects: true })
            ).map((step, index) => {
              const Icon = PROCESS_ICONS[index] ?? ClipboardList;
              return (
                <li key={step.title} className="relative">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-black text-brand-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Client feedback ” verified reviews presented as drawing annotations */}
      <ClientFeedback />

      {/* Sample work ” deliberately uneven grid */}
      <section className="bg-slate-100 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={t('home.gallery.eyebrow')}
            title={t('home.gallery.title')}
            subtitle={t('home.gallery.subtitle')}
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {galleryPreview.map((item, index) => {
              const span =
                index === 0
                  ? 'lg:col-span-4 lg:row-span-2'
                  : index === 1
                    ? 'lg:col-span-2'
                    : 'lg:col-span-2';

              return (
                <figure
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${span}`}
                >
                  <img
                    src={item.image}
                    alt={t(item.captionKey)}
                    width={736}
                    height={981}
                    loading="lazy"
                    decoding="async"
                    className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-full"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/85 to-transparent px-4 py-3 text-xs font-semibold text-white">
                    {t(item.captionKey)}
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <div className="mt-8">
            <PillButton to="/gallery" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
              {t('home.gallery.cta')}
            </PillButton>
          </div>
        </div>
      </section>

      {/* Modern equipment use and rental */}
      <EquipmentShowcase />

      {/* Location */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
                {t('home.location.eyebrow')}
              </p>
              <h2 className="mt-4 font-heading text-3xl font-black text-brand-navy sm:text-4xl">
                {t('home.location.title')}
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-slate-600">
                {t('home.location.body')}
              </p>

              <div className="mt-6 flex items-center gap-3 text-slate-700">
                <MapPin className="h-5 w-5 text-brand-orange" aria-hidden="true" />
                <span className="font-heading text-lg font-bold">{COMPANY_INFO.location}</span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PillButton
                  href={MAP_LINKS.googleDirections}
                  variant="dark"
                  icon={<Navigation className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {t('home.location.cta')}
                </PillButton>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
              <iframe
                title={t('contact.mapTitle')}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
                  '30.1163,-1.9569,30.1299,-1.9449'
                )}&layer=mapnik&marker=${encodeURIComponent('-1.9509,30.1231')}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0 sm:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact band */}
      <section className="relative overflow-hidden bg-brand-navy py-20 text-white sm:py-24">
        <div
          className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-truss.svg')] opacity-25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/30"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            {t('home.contact.eyebrow')}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-heading text-3xl font-black text-balance sm:text-4xl">
            {t('home.contact.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">{t('home.contact.subtitle')}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton to="/quote" size="md">
              {t('common.requestQuote')}
            </PillButton>
            <PillButton to="/contact" size="md" variant="light">
              {t('common.contactUs')}
            </PillButton>
          </div>
        </div>
      </section>
    </>
  );
};

