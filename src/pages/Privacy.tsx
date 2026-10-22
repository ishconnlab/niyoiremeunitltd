import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { PillButton } from '../components/common/PillButton';

const PRIVACY_SECTION_KEYS = [
  'intro',
  'collected',
  'emailjs',
  'maps',
  'retention',
  'rights',
  'children',
  'changes',
  'contact',
] as const;

export const Privacy: React.FC = () => {
  const { t, i18n } = useTranslation();

  const updatedDate = new Intl.DateTimeFormat(i18n.resolvedLanguage === 'rw' ? 'rw-RW' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  useSeo({
    title: t('meta.routes.privacy.title'),
    description: t('meta.routes.privacy.description'),
    path: '/privacy',
  });

  return (
    <>
      <PageHero
        eyebrow={t('privacy.hero.eyebrow')}
        title={t('privacy.hero.title')}
        subtitle={t('privacy.hero.subtitle')}
        compact
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-slate-500">
            {t('privacy.updated', { date: updatedDate })}
          </p>

          <div className="mt-10 space-y-10">
            {PRIVACY_SECTION_KEYS.map((key) => (
              <section key={key}>
                <h2 className="font-heading text-xl font-black text-brand-navy">
                  {t(`privacy.sections.${key}.title`)}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {t(`privacy.sections.${key}.body`)}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
            <p className="text-sm text-slate-600">{t('faq.ctaBody')}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PillButton to="/contact">{t('common.contactUs')}</PillButton>
              <PillButton to="/quote" variant="outline">
                {t('common.requestQuote')}
              </PillButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
