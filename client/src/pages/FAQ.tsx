import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search, X } from 'lucide-react';

import { FAQ_CATEGORIES, FAQS_DATA } from '../data/faqs';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { PillButton } from '../components/common/PillButton';
import { cn } from '../utils/cn';
import { contentValue, useCmsContent } from '../hooks/useCmsContent';

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(FAQS_DATA[0]?.id ?? null);
  const cmsFaqs = useCmsContent('faq');
  const faqs = useMemo(() => cmsFaqs?.length
    ? cmsFaqs.map((record) => {
      const value = contentValue(record);
      return { id: record.key, category: typeof value.category === 'string' ? value.category : 'general', question: String(value.question || ''), answer: String(value.answer || '') };
    }).filter((faq) => faq.question && faq.answer)
    : FAQS_DATA.map((faq) => ({ ...faq, question: t(`faq.items.${faq.id}.question`), answer: t(`faq.items.${faq.id}.answer`) })), [cmsFaqs, t]);

  const faqEntities = useMemo(
    () =>
      faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
    [faqs]
  );

  const breadcrumbs = useMemo(
    () => [
      { name: t('nav.home'), path: '/' },
      { name: t('nav.faq'), path: '/faq' },
    ],
    [t]
  );

  useSeo({
    title: t('meta.routes.faq.title'),
    description: t('meta.routes.faq.description'),
    path: '/faq',
    breadcrumbs,
    faqs: faqEntities,
  });

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory = category === 'all' || faq.category === category;
      if (!matchesCategory) return false;
      if (!term) return true;

      return faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term);
    });
  }, [category, faqs, query]);

  return (
    <>
      <PageHero
        eyebrow={t('faq.hero.eyebrow')}
        title={t('faq.hero.title')}
        subtitle={t('faq.hero.subtitle')}
        compact
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative">
            <label htmlFor="faq-search" className="sr-only">
              {t('faq.searchLabel')}
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('faq.searchPlaceholder')}
              className="w-full rounded-full border border-slate-300 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t('faq.clearSearch')}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {/* Category filter */}
          <div
            className="mt-6 flex flex-wrap items-center gap-2"
            role="group"
            aria-label={t('faq.searchLabel')}
          >
            {FAQ_CATEGORIES.map((option) => {
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

          {/* Questions */}
          {filtered.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="font-heading text-xl font-black text-brand-navy">
                {t('faq.emptyTitle')}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{t('faq.emptyBody')}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
                className="mt-5 text-sm font-bold text-brand-orange underline"
              >
                {t('faq.clearSearch')}
              </button>
            </div>
          ) : (
            <ul className="mt-10 space-y-3">
              {filtered.map((faq) => {
                const isOpen = openId === faq.id;
                const panelId = `faq-panel-${faq.id}`;
                const buttonId = `faq-button-${faq.id}`;

                return (
                  <li
                    key={faq.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <h2>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-6 sm:py-5"
                      >
                        <span className="font-heading text-[15px] font-bold text-brand-navy sm:text-base">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 shrink-0 text-brand-orange transition-transform',
                            isOpen && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </h2>
                    {isOpen ? (
                      <div id={panelId} role="region" aria-labelledby={buttonId} className="px-6 pb-6">
                        <p className="text-sm leading-relaxed text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy py-16 text-white">
        <div
          className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-truss.svg')] opacity-25"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black sm:text-3xl">{t('faq.ctaTitle')}</h2>
          <p className="mt-3 text-slate-300">{t('faq.ctaBody')}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton to="/contact">{t('faq.ctaButton')}</PillButton>
            <PillButton to="/quote" variant="light">
              {t('common.requestQuote')}
            </PillButton>
          </div>
        </div>
      </section>
    </>
  );
};

