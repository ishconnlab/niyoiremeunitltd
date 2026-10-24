import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';

import { COMPANY_INFO } from '../data/company';
import { useSeo } from '../hooks/useSeo';
import { PageHero } from '../components/common/PageHero';
import { MapEmbed } from '../components/common/MapEmbed';
import { ContactForm } from '../components/forms/ContactForm';
import { PillButton } from '../components/common/PillButton';

export const Contact: React.FC = () => {
  const { t } = useTranslation();

  useSeo({
    title: t('meta.routes.contact.title'),
    description: t('meta.routes.contact.description'),
    path: '/contact',
  });

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
    t('whatsapp.defaultMessage')
  )}`;

  return (
    <>
      <PageHero
        eyebrow={t('contact.hero.eyebrow')}
        title={t('contact.hero.title')}
        subtitle={t('contact.hero.subtitle')}
        compact
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Details */}
            <aside className="lg:col-span-2">
              <h2 className="font-heading text-xl font-black text-brand-navy">
                {t('contact.detailsTitle')}
              </h2>

              <dl className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-orange" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t('contact.phoneLabel')}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${COMPANY_INFO.phoneRaw}`}
                        className="font-heading text-base font-black text-brand-navy transition-colors hover:text-brand-orange"
                      >
                        {COMPANY_INFO.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-brand-orange" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t('common.whatsapp')}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-heading text-base font-black text-brand-navy transition-colors hover:text-brand-orange"
                      >
                        {COMPANY_INFO.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-brand-orange" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t('contact.emailLabel')}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${COMPANY_INFO.email}`}
                        className="font-semibold text-brand-navy transition-colors hover:text-brand-orange"
                      >
                        {COMPANY_INFO.email}
                      </a>
                      <p className="mt-1 text-xs text-slate-500">{t('contact.emailNote')}</p>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-orange" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t('contact.addressLabel')}
                    </dt>
                    <dd className="mt-1 font-semibold text-brand-navy">
                      {t('contact.addressValue')}
                    </dd>
                    <p className="mt-1 text-xs text-slate-500">{t('contact.addressNote')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-brand-orange" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t('contact.hoursLabel')}
                    </dt>
                    <dd className="mt-1 font-semibold text-brand-navy">{t('contact.hoursValue')}</dd>
                    <p className="mt-1 text-xs text-slate-500">{t('contact.responseNote')}</p>
                  </div>
                </div>
              </dl>
            </aside>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
                <h2 className="font-heading text-xl font-black text-brand-navy">
                  {t('contact.formTitle')}
                </h2>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-slate-100 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black text-brand-navy">{t('contact.mapTitle')}</h2>
          <MapEmbed className="mt-6" note={t('contact.mapNote')} />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black text-brand-navy sm:text-3xl">
            {t('home.contact.title')}
          </h2>
          <p className="mt-3 text-slate-600">{t('home.contact.subtitle')}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton to="/quote">{t('common.requestQuote')}</PillButton>
            <PillButton
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              variant="outline"
              icon={<Phone className="h-4 w-4" />}
              iconPosition="left"
            >
              {t('contact.callNow')}
            </PillButton>
            <PillButton
              href={whatsappUrl}
              variant="ghost"
              icon={<MessageSquare className="h-4 w-4" />}
              iconPosition="left"
            >
              {t('contact.whatsappChat')}
            </PillButton>
          </div>
        </div>
      </section>
    </>
  );
};
