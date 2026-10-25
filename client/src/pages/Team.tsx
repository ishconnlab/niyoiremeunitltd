import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle2, ArrowRight } from 'lucide-react';

import { COMPANY_INFO } from '../data/company';
import { TEAM_MEMBERS } from '../data/team';
import { useSeo } from '../hooks/useSeo';
import { CraneHook } from '../components/common/CraneHook';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { RulerDivider } from '../components/common/RulerDivider';

export const Team: React.FC = () => {
  const { t } = useTranslation();

  const workType = t('services.items.workforce.shortLabel');
  const workforceRequestUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
    t('whatsapp.workforceRequestWorkers', { workType })
  )}`;
  const jobInquiryUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
    t('whatsapp.workforceJobInquiry')
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

      {/* Teams */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="group rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Photo */}
                <div className="relative h-64 overflow-hidden bg-slate-900 chamfer-tl">
                  <img
                    src={member.image}
                    alt={t(member.roleKey)}
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
                      {t(member.roleKey)}
                    </h3>
                    <p className="text-xs font-semibold text-brand-orange mt-0.5">
                      {t(member.specialtyKey)}
                    </p>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">{t(member.bioKey)}</p>
                  </div>

                  {/* Responsibilities */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {t('team.card.responsibilities')}
                    </span>
                    {member.responsibilityKeys.map((key) => (
                      <div key={key} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{t(key)}</span>
                      </div>
                    ))}
                    {member.id === 'workforce' && (
                      <PillButton
                        href={workforceRequestUrl}
                        fullWidth
                        size="sm"
                        className="mt-2"
                      >
                        {t('workforce.ctaRequestWorkers')}
                      </PillButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workforce recruitment banner */}
          <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-brand-navy text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-siteplan.svg')] opacity-15 pointer-events-none"
              aria-hidden="true"
            />
            <div className="max-w-xl relative z-10">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                {t('team.recruit.badge')}
              </span>
              <h3 className="text-2xl font-bold font-heading text-white mt-1">
                {t('team.recruit.title')}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('team.recruit.body')}
              </p>
            </div>
            <PillButton href={jobInquiryUrl} size="md" className="relative z-10 shrink-0">
              {t('workforce.ctaJobInquiry')}
            </PillButton>
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

