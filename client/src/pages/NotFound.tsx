import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';

import { useSeo } from '../hooks/useSeo';
import { PillButton } from '../components/common/PillButton';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  useSeo({
    title: t('meta.routes.notFound.title'),
    description: t('meta.routes.notFound.description'),
    path: '/404',
    noIndex: true,
  });

  return (
    <section className="relative overflow-hidden bg-brand-navy py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern-dark" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-construction.svg')] opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange text-white">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </span>

        <p className="mt-8 font-heading text-7xl font-black text-brand-orange sm:text-8xl">404</p>

        <h1 className="mt-4 font-heading text-3xl font-black sm:text-4xl">{t('notFound.title')}</h1>
        <p className="mt-4 text-slate-300">{t('notFound.body')}</p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PillButton to="/">{t('notFound.homeCta')}</PillButton>
          <PillButton to="/services" variant="light">
            {t('notFound.servicesCta')}
          </PillButton>
        </div>
      </div>
    </section>
  );
};

