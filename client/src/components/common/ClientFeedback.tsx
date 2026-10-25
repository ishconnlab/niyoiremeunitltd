import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Quote } from 'lucide-react';

import { CLIENT_REVIEWS, type ClientReview } from '../../data/reviews';
import { asArray } from '../../utils/i18n';
import { LocalizedLink } from './LocalizedLink';
import { PillButton } from './PillButton';

type DelayStyle = React.CSSProperties & { '--review-delay'?: string };
type TickStyle = React.CSSProperties & { '--tick-index'?: number };

/** Small technical tick used instead of a star rating. */
const QualityTicks: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex items-center gap-1.5" aria-hidden="true">
    {[1, 2, 3, 4, 5].map((tick) => (
      <span
        key={tick}
        className={`review-card__tick h-2.5 w-2.5 border ${
          tick <= rating
            ? 'border-brand-orange bg-brand-orange'
            : 'border-slate-300 bg-transparent'
        }`}
        style={{ '--tick-index': tick } as TickStyle}
      />
    ))}
  </span>
);

const CornerTicks: React.FC = () => (
  <>
    <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-brand-navy" aria-hidden="true" />
    <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-brand-navy" aria-hidden="true" />
    <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-brand-navy" aria-hidden="true" />
    <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-brand-navy" aria-hidden="true" />
  </>
);

/** One review, set out like an annotated detail drawing on a sheet. */
const ReviewCard: React.FC<{
  review: ClientReview;
  index: number;
  clone?: boolean;
}> = ({ review, index, clone = false }) => {
  const { t } = useTranslation();

  return (
    <li
      className="review-card group relative"
      style={{ '--review-delay': `${index * 110}ms` } as DelayStyle}
      aria-hidden={clone || undefined}
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 hover:border-brand-navy/25">
        <span className="review-card__rule absolute inset-x-0 top-0 h-[3px] bg-brand-orange" aria-hidden="true" />
        <span
          className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative p-4 sm:p-5">
          <CornerTicks />

          <div className="flex items-center justify-between gap-3 pl-3">
            <QualityTicks rating={review.rating} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {t('reviews.qualityLabel')}
            </span>
          </div>
          <span className="mt-1.5 block pl-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            {t('reviews.indexLabel')} {String(index + 1).padStart(2, '0')}
          </span>

          <Quote
            className="pointer-events-none absolute right-4 top-10 h-12 w-12 text-brand-orange/10"
            aria-hidden="true"
          />

          <blockquote className="relative mt-3 font-heading text-base leading-relaxed text-brand-navy sm:text-lg line-clamp-3">
            {t(review.quoteKey)}
          </blockquote>

          <div className="relative mt-4 flex flex-wrap items-end justify-between gap-2.5 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
                <img
                  src="/assets/brand/logo-mark.svg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-7 object-contain"
                />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-navy">{t(review.attributionKey)}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  {t(review.projectKey)}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              {t('reviews.cardLabel')}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

/**
 * Client feedback, presented as an architect's drawing sheet: a technical
 * section drawing on the left and the review annotations on the right.
 *
 * Only feedback that NIYO IREME has actually received is published here â€” the
 * list in `src/data/reviews.ts` stays empty until real, agreed reviews are
 * added, so the page never shows an invented testimonial.
 */
export const ClientFeedback: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const hasReviews = CLIENT_REVIEWS.length > 0;
  const legend = asArray<string>(t('reviews.legend', { returnObjects: true }));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Safety net: never leave the cards hidden if the observer never fires.
    const fallback = window.setTimeout(() => setInView(true), 1600);

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      window.clearTimeout(fallback);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`reviews-section bg-slate-50 py-20 sm:py-24${inView ? ' is-visible' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              <span className="h-px w-8 bg-brand-orange" aria-hidden="true" />
              {t('reviews.eyebrow')}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-black text-brand-navy sm:text-4xl">
              {t('reviews.title')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {t('reviews.subtitle')}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-white">
              <Quote className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-lg font-black leading-none text-brand-navy">
                {String(CLIENT_REVIEWS.length).padStart(2, '0')}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {t('reviews.sheetLabel')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Drawing sheet */}
          <figure className="lg:col-span-5">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-brand-navy shadow-lg">
              <img
                src="/assets/brand/blueprint-section.svg"
                alt={t('reviews.drawingAlt')}
                loading="lazy"
                decoding="async"
                className="w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
              />

              {/* Scanning beam â€” the drawing "reads" itself */}
              <span
                className="review-sheet__scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-brand-orange/25 to-transparent"
                aria-hidden="true"
              />

              {/* Title block */}
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-px bg-white/10 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                <span className="bg-brand-navy/90 px-3 py-2">{t('reviews.sheetLabel')}</span>
                <span className="bg-brand-navy/90 px-3 py-2 text-right">REF. NIYO-IREME-01</span>
              </div>
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-slate-500">
              {t('reviews.drawingCaption')}
            </figcaption>

            {legend.length > 0 ? (
              <ul className="mt-6 grid gap-2.5">
                {legend.map((entry) => (
                  <li key={entry} className="flex items-start gap-3 text-sm text-slate-600">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-brand-orange"
                      aria-hidden="true"
                    />
                    {entry}
                  </li>
                ))}
              </ul>
            ) : null}
          </figure>

          {/* Annotations */}
          <div className="lg:col-span-7">
            {hasReviews ? (
              CLIENT_REVIEWS.length > 2 ? (
                <div className="reviews-carousel" aria-label={t('reviews.title')}>
                  <ul
                    className="reviews-track"
                    style={
                      {
                        '--reviews-duration': `${CLIENT_REVIEWS.length * 9}s`,
                      } as React.CSSProperties
                    }
                  >
                    {[...CLIENT_REVIEWS, ...CLIENT_REVIEWS].map((review, index) => (
                      <ReviewCard
                        key={`${review.id}-${index}`}
                        review={review}
                        index={index % CLIENT_REVIEWS.length}
                        clone={index >= CLIENT_REVIEWS.length}
                      />
                    ))}
                  </ul>
                </div>
              ) : (
                <ol className="grid gap-6 sm:grid-cols-2">
                  {CLIENT_REVIEWS.map((review, index) => (
                    <ReviewCard key={review.id} review={review} index={index} />
                  ))}
                </ol>
              )
            ) : (
              <div className="review-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <span
                  className="review-card__rule absolute inset-x-0 top-0 h-[3px] bg-brand-orange"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-70"
                  aria-hidden="true"
                />
                <Quote
                  className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 text-brand-orange/10"
                  aria-hidden="true"
                />

                <div className="relative p-5 sm:p-7">
                  <div className="relative rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 sm:p-8">
                    <CornerTicks />

                    <div className="flex items-center justify-between gap-4 pl-3">
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                        <span className="h-px w-6 bg-brand-orange" aria-hidden="true" />
                        {t('reviews.emptyLabel')}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                        {t('reviews.indexLabel')} 01
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3 pl-3">
                      <QualityTicks rating={0} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        {t('reviews.qualityLabel')}
                      </span>
                    </div>

                    <h3 className="mt-4 font-heading text-xl font-black text-brand-navy sm:text-2xl">
                      {t('reviews.emptyTitle')}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                      {t('reviews.emptyBody')}
                    </p>

                    <div className="mt-6 space-y-3 pl-3" aria-hidden="true">
                      {['100%', '82%', '58%'].map((width) => (
                        <span
                          key={width}
                          className="review-card__rule block h-2 rounded-full bg-slate-200"
                          style={{ width }}
                        />
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <PillButton to="/quote" icon={<ArrowRight className="h-4 w-4" />}>
                        {t('reviews.emptyCta')}
                      </PillButton>
                      <PillButton to="/contact" variant="outline">
                        {t('common.contactUs')}
                      </PillButton>
                    </div>

                    <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
                      {t('reviews.emptyNote')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-center">
          <LocalizedLink
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-navy transition-colors hover:text-brand-orange"
          >
            {t('home.gallery.cta')}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </LocalizedLink>
        </p>
      </div>
    </section>
  );
};

