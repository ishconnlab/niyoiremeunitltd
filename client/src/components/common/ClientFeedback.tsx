import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

import { CLIENT_REVIEWS, type ClientReview } from '../../data/reviews';
import { LocalizedLink } from './LocalizedLink';
import { PillButton } from './PillButton';

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
      />
    ))}
  </span>
);

/** Corner detail marks on each card. */
const CornerTicks: React.FC = () => (
  <>
    <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-brand-navy" aria-hidden="true" />
    <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-brand-navy" aria-hidden="true" />
    <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-brand-navy" aria-hidden="true" />
    <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-brand-navy" aria-hidden="true" />
  </>
);

/** One review card with clean, professional styling. */
const ReviewCard: React.FC<{
  review: ClientReview;
  index: number;
}> = ({ review, index }) => {
  const { t } = useTranslation();

  return (
    <article
      className="review-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 hover:border-brand-navy/25 hover:shadow-md"
      aria-label={`Review ${index + 1}`}
    >
      <span className="review-card__rule absolute inset-x-0 top-0 h-[3px] bg-brand-orange" aria-hidden="true" />

      <div className="relative p-6 sm:p-8">
        <CornerTicks />

        <div className="flex items-center justify-between gap-3 pl-1">
          <QualityTicks rating={review.rating} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {t('reviews.qualityLabel')}
          </span>
        </div>

        <span className="mt-2 block pl-1 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
          {t('reviews.indexLabel')} {String(index + 1).padStart(2, '0')}
        </span>

        <Quote
          className="pointer-events-none absolute right-6 top-16 h-12 w-12 text-brand-orange/10"
          aria-hidden="true"
        />

        <blockquote className="relative mt-5 font-heading text-base leading-relaxed text-brand-navy sm:text-lg line-clamp-3">
          {t(review.quoteKey)}
        </blockquote>

        <div className="relative mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
              <img
                src="/assets/brand/logo-mark.svg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-8 w-8 object-contain"
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
    </article>
  );
};

/**
 * Client feedback presented as clean professional cards with manual navigation.
 * Only feedback NIYO IREME has actually received is published here.
 */
export const ClientFeedback: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasReviews = CLIENT_REVIEWS.length > 0;
  const visibleCount = 2; // show 2 cards on desktop, 1 on mobile
  const maxIndex = Math.max(0, CLIENT_REVIEWS.length - visibleCount);

  const prev = () => setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const next = () => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));

  const visibleReviews = hasReviews
    ? CLIENT_REVIEWS.slice(currentIndex, currentIndex + visibleCount)
    : [];

  return (
    <section className="reviews-section bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
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

        <div className="mt-12 relative">
          {hasReviews ? (
            <>
              {/* Navigation arrows */}
              <button
                onClick={prev}
                disabled={currentIndex <= 0 && CLIENT_REVIEWS.length <= visibleCount}
                aria-label={t('reviews.prevLabel')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white border border-slate-200 text-brand-navy flex items-center justify-center shadow-sm hover:bg-brand-navy hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex && CLIENT_REVIEWS.length > visibleCount}
                aria-label={t('reviews.nextLabel')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white border border-slate-200 text-brand-navy flex items-center justify-center shadow-sm hover:bg-brand-navy hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Cards */}
              <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
                {visibleReviews.map((review, index) => (
                  <ReviewCard key={review.id} review={review} index={currentIndex + index} />
                ))}
              </div>

              {/* Page indicator */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {hasReviews && CLIENT_REVIEWS.length > visibleCount && (
                  <>
                    <span>
                      {Math.min(currentIndex + visibleCount, CLIENT_REVIEWS.length)}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{CLIENT_REVIEWS.length}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <article className="review-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <span className="review-card__rule absolute inset-x-0 top-0 h-[3px] bg-brand-orange" aria-hidden="true" />
              <span
                className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-70"
                aria-hidden="true"
              />
              <Quote
                className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 text-brand-orange/10"
                aria-hidden="true"
              />

              <div className="relative p-6 sm:p-8">
                <CornerTicks />

                <div className="flex items-center justify-between gap-4 pl-1">
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                    <span className="h-px w-6 bg-brand-orange" aria-hidden="true" />
                    {t('reviews.emptyLabel')}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    {t('reviews.indexLabel')} 01
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 pl-1">
                  <QualityTicks rating={0} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {t('reviews.qualityLabel')}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-xl font-black text-brand-navy sm:text-2xl">
                  {t('reviews.emptyTitle')}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                  {t('reviews.emptyBody')}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PillButton to="/quote" icon={<ArrowRight className="h-4 w-4" />}>
                    {t('reviews.emptyCta')}
                  </PillButton>
                  <PillButton to="/contact" variant="outline">
                    {t('common.contactUs')}
                  </PillButton>
                </div>

                <p className="mt-8 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
                  {t('reviews.emptyNote')}
                </p>
              </div>
            </article>
          )}
        </div>

        <p className="mt-12 text-center">
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
