import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck, Copy, MessageSquare, Send } from 'lucide-react';

import { FormFeedback, type FeedbackState } from './FormFeedback';
import { FormField, inputClasses, inputErrorClasses } from './FormField';
import { PillButton } from '../common/PillButton';
import { COMPANY_INFO } from '../../data/company';
import { EmailNotConfiguredError, sendEmail } from '../../utils/emailjs';
import {
  AREA_BOUNDS,
  DURATION_BOUNDS,
  WORKER_BOUNDS,
  buildQuoteSummaryText,
  calculateQuotationEstimate,
  clampArea,
  clampWeeks,
  clampWorkers,
  formatRWF,
} from '../../utils/quotation';
import type { FinishingTier, ProjectType, ServiceCategory } from '../../types';

interface QuoteFormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  timeline: string;
  message: string;
}

const PHONE_PATTERN = /^[+()\d\s-]{7,20}$/;

const SERVICE_OPTIONS: { id: ServiceCategory; labelKey: string }[] = [
  { id: 'finishing', labelKey: 'services.items.finishing.shortLabel' },
  { id: 'painting', labelKey: 'services.items.painting.shortLabel' },
  { id: 'construction', labelKey: 'services.items.construction.shortLabel' },
  { id: 'workforce', labelKey: 'services.items.workforce.shortLabel' },
];

const PROJECT_TYPE_OPTIONS: { id: ProjectType; labelKey: string }[] = [
  { id: 'residential', labelKey: 'quote.projectTypes.residential' },
  { id: 'commercial', labelKey: 'quote.projectTypes.commercial' },
  { id: 'renovation', labelKey: 'quote.projectTypes.renovation' },
  { id: 'exterior', labelKey: 'quote.projectTypes.exterior' },
];

const TIER_OPTIONS: { id: FinishingTier; labelKey: string }[] = [
  { id: 'standard', labelKey: 'quote.tiers.standard' },
  { id: 'premium', labelKey: 'quote.tiers.premium' },
  { id: 'luxury_executive', labelKey: 'quote.tiers.luxury' },
];

export const QuoteForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [copied, setCopied] = useState(false);
  const submittedRef = useRef(false);

  const [service, setService] = useState<ServiceCategory>('finishing');
  const [projectType, setProjectType] = useState<ProjectType>('residential');
  const [tier, setTier] = useState<FinishingTier>('premium');
  const [area, setArea] = useState(120);
  const [workers, setWorkers] = useState(4);
  const [weeks, setWeeks] = useState(2);
  const [includeMaterials, setIncludeMaterials] = useState(true);

  const locale = i18n.resolvedLanguage === 'rw' ? 'rw-RW' : 'en-RW';

  const scope = useMemo(
    () => ({
      serviceCategory: service,
      projectType,
      tier,
      areaSquareMeters: area,
      workforceCount: workers,
      workforceDurationWeeks: weeks,
      needMaterialsIncluded: includeMaterials,
    }),
    [service, projectType, tier, area, workers, weeks, includeMaterials]
  );

  const estimate = useMemo(() => calculateQuotationEstimate(scope), [scope]);

  const serviceLabel = t(`services.items.${service}.title`);
  const projectTypeLabel = t(`quote.projectTypes.${projectType}`);
  const tierLabel = t(
    tier === 'luxury_executive' ? 'quote.tiers.luxury' : `quote.tiers.${tier}`
  );

  const estimateRange = `${formatRWF(estimate.estimatedMinRWF, locale)} “ ${formatRWF(
    estimate.estimatedMaxRWF,
    locale
  )}`;

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('validation.nameMin')),
        email: z
          .string()
          .trim()
          .refine((value) => value === '' || z.string().email().safeParse(value).success, {
            message: t('validation.emailInvalid'),
          }),
        phone: z
          .string()
          .trim()
          .min(7, t('validation.phoneInvalid'))
          .regex(PHONE_PATTERN, t('validation.phoneInvalid')),
        location: z.string().trim().min(3, t('validation.locationMin')),
        timeline: z.string().min(1, t('validation.selectRequired')),
        message: z.string().trim().min(10, t('validation.messageMin')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      timeline: '',
      message: '',
    },
  });

  const summaryText = useMemo(
    () =>
      buildQuoteSummaryText(scope, estimate, {
        serviceLabel,
        projectTypeLabel,
        tierLabel,
        estimateRange,
        durationWeeks: estimate.suggestedDurationWeeks,
      }),
    [scope, estimate, serviceLabel, projectTypeLabel, tierLabel, estimateRange]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleWhatsApp = () => {
    const values = getValues();
    const text = buildQuoteSummaryText(scope, estimate, {
      name: values.name || undefined,
      phone: values.phone || undefined,
      location: values.location || undefined,
      message: values.message || undefined,
      serviceLabel,
      projectTypeLabel,
      tierLabel,
      estimateRange,
      durationWeeks: estimate.suggestedDurationWeeks,
    });

    window.open(
      `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const onSubmit = handleSubmit(async (values) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    try {
      await sendEmail('quote', {
        from_name: values.name,
        reply_to: values.email || values.phone,
        email: values.email,
        phone: values.phone,
        location: values.location,
        timeline: values.timeline,
        message: values.message,
        service: serviceLabel,
        project_type: projectTypeLabel,
        tier: tierLabel,
        estimate: estimateRange,
        duration_weeks: estimate.suggestedDurationWeeks,
        area: service === 'workforce' ? undefined : clampArea(area),
        workers: service === 'workforce' ? clampWorkers(workers) : undefined,
        weeks: service === 'workforce' ? clampWeeks(weeks) : undefined,
        materials_included: service === 'workforce' ? undefined : includeMaterials,
        source: 'quotation-page',
      });

      setFeedback('success');
      reset();
    } catch (error) {
      if (error instanceof EmailNotConfiguredError) {
        setFeedback('not-configured');
      } else {
        setFeedback('error');
      }
    } finally {
      submittedRef.current = false;
    }
  });

  const isWorkforce = service === 'workforce';

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Scope */}
      <section className="lg:col-span-3" aria-labelledby="quote-scope-heading">
        <h2 id="quote-scope-heading" className="font-heading text-xl font-black text-brand-navy">
          {t('quote.calculator.title')}
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField id="quote-service" label={t('quote.calculator.serviceLabel')} required>
            <select
              id="quote-service"
              className={inputClasses}
              value={service}
              onChange={(event) => setService(event.target.value as ServiceCategory)}
            >
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="quote-project-type" label={t('quote.calculator.projectTypeLabel')} required>
            <select
              id="quote-project-type"
              className={inputClasses}
              value={projectType}
              onChange={(event) => setProjectType(event.target.value as ProjectType)}
            >
              {PROJECT_TYPE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="quote-tier" label={t('quote.calculator.tierLabel')} required>
            <select
              id="quote-tier"
              className={inputClasses}
              value={tier}
              onChange={(event) => setTier(event.target.value as FinishingTier)}
            >
              {TIER_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </FormField>

          {isWorkforce ? (
            <>
              <FormField id="quote-workers" label={t('quote.calculator.workersLabel')} required>
                <input
                  id="quote-workers"
                  type="number"
                  min={WORKER_BOUNDS.min}
                  max={WORKER_BOUNDS.max}
                  className={inputClasses}
                  value={workers}
                  onChange={(event) => setWorkers(clampWorkers(Number(event.target.value)))}
                />
              </FormField>

              <FormField id="quote-duration" label={t('quote.calculator.durationLabel')} required>
                <input
                  id="quote-duration"
                  type="number"
                  min={DURATION_BOUNDS.min}
                  max={DURATION_BOUNDS.max}
                  className={inputClasses}
                  value={weeks}
                  onChange={(event) => setWeeks(clampWeeks(Number(event.target.value)))}
                />
              </FormField>
            </>
          ) : (
            <FormField id="quote-area" label={t('quote.calculator.areaLabel')} required>
              <input
                id="quote-area"
                type="number"
                min={AREA_BOUNDS.min}
                max={AREA_BOUNDS.max}
                className={inputClasses}
                value={area}
                onChange={(event) => setArea(clampArea(Number(event.target.value)))}
              />
            </FormField>
          )}

          {!isWorkforce ? (
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <input
                  type="checkbox"
                  checked={includeMaterials}
                  onChange={(event) => setIncludeMaterials(event.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    {t('quote.calculator.materialsLabel')}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {t('quote.calculator.materialsHelp')}
                  </span>
                </span>
              </label>
            </div>
          ) : null}
        </div>
      </section>

      {/* Estimate */}
      <aside className="lg:col-span-2" aria-labelledby="quote-estimate-heading">
        <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 id="quote-estimate-heading" className="font-heading text-xl font-black text-brand-navy">
            {t('quote.calculator.estimateTitle')}
          </h2>

          <p className="mt-3 font-heading text-2xl font-black text-brand-orange">
            {estimateRange}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {t('quote.calculator.durationEstimate', { weeks: estimate.suggestedDurationWeeks })}
          </p>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('quote.calculator.breakdownTitle')}
          </h3>
          <dl className="mt-2 space-y-2 text-sm">
            {estimate.breakdown.map((item) => (
              <div key={item.labelKey} className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-600">
                  {t(item.labelKey, item.params as Record<string, string | number> | undefined)}
                </dt>
                <dd className="shrink-0 font-semibold text-slate-800">
                  {formatRWF(item.amountRWF, locale)}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('quote.calculator.notesTitle')}
          </h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-slate-600">
            {estimate.noteKeys.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>

          <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
            {t('quote.calculator.disclaimer')}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <PillButton
              size="sm"
              variant="outline"
              icon={copied ? <ClipboardCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              iconPosition="left"
              onClick={() => {
                void handleCopy();
              }}
            >
              {copied ? t('quote.calculator.copied') : t('quote.calculator.copy')}
            </PillButton>
            <PillButton
              size="sm"
              variant="ghost"
              icon={<MessageSquare className="h-4 w-4" />}
              iconPosition="left"
              onClick={handleWhatsApp}
            >
              {t('quote.calculator.whatsapp')}
            </PillButton>
          </div>
        </div>
      </aside>

      {/* Details */}
      <section className="lg:col-span-5" aria-labelledby="quote-details-heading">
        <h2 id="quote-details-heading" className="font-heading text-xl font-black text-brand-navy">
          {t('quote.form.title')}
        </h2>

        <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
          <FormFeedback
            state={feedback}
            successBody={t('quote.form.successBody', {
              name: getValues('name') || t('quote.form.name'),
              phone: getValues('phone') || COMPANY_INFO.phoneDisplay,
            })}
            onReset={() => setFeedback('idle')}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="quote-name" label={t('quote.form.name')} error={errors.name?.message} required>
              <input
                id="quote-name"
                type="text"
                autoComplete="name"
                placeholder={t('quote.form.namePlaceholder')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'quote-name-error' : undefined}
                className={errors.name ? inputErrorClasses : inputClasses}
                {...register('name')}
              />
            </FormField>

            <FormField id="quote-phone" label={t('quote.form.phone')} error={errors.phone?.message} required>
              <input
                id="quote-phone"
                type="tel"
                autoComplete="tel"
                placeholder={t('quote.form.phonePlaceholder')}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'quote-phone-error' : undefined}
                className={errors.phone ? inputErrorClasses : inputClasses}
                {...register('phone')}
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="quote-email"
              label={t('quote.form.email')}
              error={errors.email?.message}
              optionalLabel={t('common.optional')}
            >
              <input
                id="quote-email"
                type="email"
                autoComplete="email"
                placeholder={t('quote.form.emailPlaceholder')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'quote-email-error' : undefined}
                className={errors.email ? inputErrorClasses : inputClasses}
                {...register('email')}
              />
            </FormField>

            <FormField id="quote-location" label={t('quote.form.location')} error={errors.location?.message} required>
              <input
                id="quote-location"
                type="text"
                placeholder={t('quote.form.locationPlaceholder')}
                aria-invalid={Boolean(errors.location)}
                aria-describedby={errors.location ? 'quote-location-error' : undefined}
                className={errors.location ? inputErrorClasses : inputClasses}
                {...register('location')}
              />
            </FormField>
          </div>

          <FormField id="quote-timeline" label={t('quote.form.timeline')} error={errors.timeline?.message} required>
            <select
              id="quote-timeline"
              aria-invalid={Boolean(errors.timeline)}
              aria-describedby={errors.timeline ? 'quote-timeline-error' : undefined}
              className={`${errors.timeline ? inputErrorClasses : inputClasses} appearance-none`}
              {...register('timeline')}
            >
              <option value="">{t('validation.selectRequired')}</option>
              <option value="immediate">{t('quote.form.timelineOptions.immediate')}</option>
              <option value="twoWeeks">{t('quote.form.timelineOptions.twoWeeks')}</option>
              <option value="nextMonth">{t('quote.form.timelineOptions.nextMonth')}</option>
              <option value="planning">{t('quote.form.timelineOptions.planning')}</option>
            </select>
          </FormField>

          <FormField id="quote-message" label={t('quote.form.message')} error={errors.message?.message} required>
            <textarea
              id="quote-message"
              rows={5}
              placeholder={t('quote.form.messagePlaceholder')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'quote-message-error' : undefined}
              className={`${errors.message ? inputErrorClasses : inputClasses} resize-y`}
              {...register('message')}
            />
          </FormField>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PillButton
              type="submit"
              disabled={isSubmitting}
              icon={<Send className="h-4 w-4" />}
              iconPosition="left"
            >
              {isSubmitting ? t('quote.form.submitting') : t('quote.form.submit')}
            </PillButton>

            <p className="text-xs text-slate-500">
              {t('quote.form.whatsappAlternative')}{' '}
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-navy underline"
              >
                {t('common.whatsapp')}
              </a>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

