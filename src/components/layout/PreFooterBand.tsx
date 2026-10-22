import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Phone } from 'lucide-react';

import { COMPANY_INFO } from '../../data/company';
import { PillButton } from '../common/PillButton';

/**
 * Band that sits directly above the footer.
 *
 * It carries the FAQ link as a button — the FAQ deliberately stays out of the
 * header navigation — together with the two other next steps a visitor can
 * take: request a quotation or call the office.
 */
export const PreFooterBand: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              {t('prefooter.eyebrow')}
            </p>
            <h2 className="mt-3 font-heading text-2xl font-black text-brand-navy sm:text-3xl">
              {t('prefooter.title')}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              {t('prefooter.body')}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-6 lg:justify-end">
            <PillButton
              to="/faq"
              size="md"
              variant="outline"
              icon={<HelpCircle className="h-4 w-4" />}
              iconPosition="left"
            >
              {t('prefooter.faqCta')}
            </PillButton>

            <PillButton to="/quote" size="md">
              {t('prefooter.quoteCta')}
            </PillButton>

            <PillButton
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              size="md"
              variant="ghost"
              icon={<Phone className="h-4 w-4" />}
              iconPosition="left"
            >
              {t('prefooter.phoneCta', { phone: COMPANY_INFO.phoneDisplay })}
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
};
