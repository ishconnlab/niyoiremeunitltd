import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Expand } from 'lucide-react';

import { GALLERY_CATEGORIES, GALLERY_DATA } from '../data/gallery';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { PillButton } from '../components/common/PillButton';
import { Lightbox } from '../components/common/Lightbox';
import { cn } from '../utils/cn';
import { useCmsContent } from '../hooks/useCmsContent';

export const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const cmsGallery = useCmsContent('gallery');

  useSeo({
    title: t('meta.routes.gallery.title'),
    description: t('meta.routes.gallery.description'),
    path: '/gallery',
  });

  const allItems = cmsGallery?.length
    ? cmsGallery.flatMap((record) => {
      const value = record.value && typeof record.value === 'object' && !Array.isArray(record.value) ? record.value as Record<string, unknown> : {};
      const image = record.imageUrl || (typeof value.image === 'string' ? value.image : typeof value.url === 'string' ? value.url : '');
      if (!image) return [];
      return [{ id: record.key, category: typeof value.category === 'string' ? value.category : 'finishing', image, caption: typeof value.caption === 'string' ? value.caption : record.key }];
    })
    : GALLERY_DATA.map((item) => ({ id: item.id, category: item.category, image: item.image, caption: t(item.captionKey) }));
  const items = useMemo(() => category === 'all' ? allItems : allItems.filter((item) => item.category === category), [allItems, category]);

  const lightboxItems = items.map((item) => ({
    src: item.image,
    alt: item.caption,
  }));

  return (
    <>
      <PageHero
        eyebrow={t('gallery.hero.eyebrow')}
        title={t('gallery.hero.title')}
        subtitle={t('gallery.hero.subtitle')}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label={t('gallery.filterLabel')}
          >
            {GALLERY_CATEGORIES.map((option) => {
              const isActive = option.id === category;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCategory(option.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'min-h-10 rounded-full px-4 py-2 text-xs font-bold transition-colors sm:min-h-11',
                    isActive
                      ? 'bg-brand-orange text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-orange/50 hover:text-brand-navy'
                  )}
                >
                  {t(option.labelKey)}
                </button>
              );
            })}
          </div>

          {items.length === 0 ? (
            <div className="mt-16 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="font-heading text-xl font-black text-brand-navy">
                {t('gallery.emptyTitle')}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{t('gallery.emptyBody')}</p>
            </div>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <li key={item.id}>
                  <figure className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <img
                      src={item.image}
                      alt={item.caption}
                      width={736}
                      height={552}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={t('common.expandImage')}
                      className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-brand-navy opacity-100 transition-opacity hover:bg-brand-orange hover:text-white sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100"
                    >
                      <Expand className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <figcaption className="px-4 py-3 text-xs font-semibold text-slate-600">
                      {item.caption}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy py-16 text-white">
        <div
          className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-excavator.svg')] opacity-25"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black sm:text-3xl">{t('gallery.ctaTitle')}</h2>
          <p className="mt-3 text-slate-300">{t('gallery.ctaBody')}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton to="/quote">{t('common.requestQuote')}</PillButton>
            <PillButton to="/services" variant="light">
              {t('common.backToServices')}
            </PillButton>
          </div>
        </div>
      </section>

      <Lightbox
        isOpen={lightboxIndex !== null}
        items={lightboxItems}
        currentIndex={lightboxIndex ?? 0}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
};

