import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

import { COMPANY_INFO } from '../data/company';
import { LEADERSHIP, TEAM_MEMBERS } from '../data/team';
import { useSeo } from '../hooks/useSeo';
import { CraneHook } from '../components/common/CraneHook';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { RulerDivider } from '../components/common/RulerDivider';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

export const Team: React.FC = () => {
  const { t } = useTranslation();

  const companyWhatsAppUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
    t('whatsapp.defaultMessage')
  )}`;

  useSeo({
    title: t('meta.routes.team.title'),
    description: t('meta.routes.team.description'),
    path: '/team',
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-16 lg:py-20 relative overflow-hidden">
        <div
          className="w-full h-full bg-blueprint-drawing bg-[url('/assets/brand/blueprint-crane.svg')] absolute inset-0 opacity-20 pointer-events-none"
        />
        <div className="w-full h-full bg-hazard-stripes absolute inset-0 opacity-20 pointer-events-none" />
        <div className="hidden lg:block absolute -top-2 right-16 z-10 pointer-events-none">
          <CraneHook className="w-20 h-36" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-3.5 h-3.5 text-brand-orange" />
              {t('team.hero.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
              {t('team.hero.title')}{' '}
              <span className="text-brand-orange">{t('team.hero.titleAccent')}</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {t('team.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-[2px] bg-brand-orange" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t('team.leadership.badge')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-brand-navy">
            {t('team.leadership.title')}
          </h2>

          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="relative h-72 overflow-hidden bg-slate-900">
                <img
                  src={LEADERSHIP.image}
                  alt={t(LEADERSHIP.imageAltKey)}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-brand-orange text-white shadow-md">
                  {t(LEADERSHIP.badgeKey)}
                </span>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  {LEADERSHIP.name}
                </h3>
                <p className="text-sm font-semibold text-brand-orange mt-1">
                  {t(LEADERSHIP.specialtyKey)}
                </p>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {t(LEADERSHIP.bioKey)}
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {t('team.card.responsibilities')}
                  </span>
                  {LEADERSHIP.responsibilityKeys.map((key) => (
                    <div key={key} className="flex items-start gap-1.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{t(key)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 relative">
        <RulerDivider className="absolute top-0 left-0 right-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-brand-orange" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t('team.section.badge')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-brand-navy">
              {t('team.section.title')}{' '}
              <span className="text-brand-orange">{t('team.section.titleAccent')}</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t('team.section.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => {
              return (
                <div
                  key={member.id}
                  className="group rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Photo */}
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={member.image}
                      alt={t(member.imageAltKey)}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-brand-orange text-white shadow-md">
                      {t(member.badgeKey)}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-heading text-brand-navy group-hover:text-brand-orange transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-brand-orange mt-0.5">
                        {t(member.roleKey)}
                      </p>

                      <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                        {t(member.bioKey)}
                      </p>
                    </div>

                    {/* Contact buttons — fall back to company contact when member has no individual number */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-2">
                        <PillButton
                          href={`tel:${member.phone || COMPANY_INFO.phoneRaw}`}
                          size="sm"
                          variant="outline"
                          fullWidth
                          icon={<Phone className="h-4 w-4 text-brand-navy" />}
                          iconPosition="left"
                          ariaLabel={member.phone ? `Call ${member.name}` : `Call company`}
                        >
                          {member.phone ? 'Call' : 'Call company'}
                        </PillButton>
                        {member.whatsapp ? (
                          <PillButton
                            href={`https://wa.me/${member.whatsapp}?text=${encodeURIComponent(
                              t('whatsapp.contactMember', { name: member.name })
                            )}`}
                            size="sm"
                            variant="primary"
                            fullWidth
                            icon={<WhatsAppIcon className="h-4 w-4 text-white" />}
                            iconPosition="left"
                            ariaLabel={`WhatsApp ${member.name}`}
                          >
                            WhatsApp
                          </PillButton>
                        ) : (
                          <PillButton
                            href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                              t('whatsapp.defaultMessage')
                            )}`}
                            size="sm"
                            variant="outline"
                            fullWidth
                            icon={<WhatsAppIcon className="h-4 w-4 text-brand-navy" />}
                            iconPosition="left"
                            ariaLabel="WhatsApp company"
                          >
                            WhatsApp company
                          </PillButton>
                        )}
                      </div>
                    </div>

                    {/* Responsibilities */}
                    {member.responsibilityKeys.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {t('team.card.responsibilities')}
                        </span>
                        {member.responsibilityKeys.map((key) => (
                          <div key={key} className="flex items-start gap-1.5 text-[10px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{t(key)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Company-wide contact fallback */}
          <div className="mt-12 p-8 rounded-3xl bg-brand-navy text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700 relative overflow-hidden">
            <div className="max-w-xl relative z-10">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                {t('team.contact.badge')}
              </span>
              <h3 className="text-2xl font-bold font-heading text-white mt-1">
                {t('team.contact.title')}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('team.contact.body')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
              <PillButton
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                size="md"
                variant="light"
                icon={<Phone className="h-4 w-4" />}
                iconPosition="left"
              >
                {t('team.contact.callCompany')}
              </PillButton>
              <PillButton
                href={companyWhatsAppUrl}
                size="md"
                variant="outline"
                icon={<WhatsAppIcon className="h-4 w-4" />}
                iconPosition="left"
              >
                {t('team.contact.whatsappCompany')}
              </PillButton>
            </div>
          </div>
        </div>
      </section>

      {/* Next step */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LocalizedLink
            to="/quote"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange-dark"
          >
            {t('common.requestQuote')}
            <ArrowRight className="w-4 w-4" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </section>
    </div>
  );
};
