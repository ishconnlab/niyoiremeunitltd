import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { QuoteForm } from '../components/forms/QuoteForm';

export const Quote: React.FC = () => {
  const { t } = useTranslation();

  useSeo({
    title: t('meta.routes.quote.title'),
    description: t('meta.routes.quote.description'),
    path: '/quote',
  });

  return (
    <>
      <PageHero
        eyebrow={t('quote.hero.eyebrow')}
        title={t('quote.hero.title')}
        subtitle={t('quote.hero.subtitle')}
        compact
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <QuoteForm />
        </div>
      </section>
    </>
  );
};

