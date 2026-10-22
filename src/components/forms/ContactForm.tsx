import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Loader2, Send } from 'lucide-react';

import { FormFeedback, type FeedbackState } from './FormFeedback';
import { FormField, inputClasses, inputErrorClasses } from './FormField';
import { PillButton } from '../common/PillButton';
import { COMPANY_INFO } from '../../data/company';
import { EmailNotConfiguredError, sendEmail } from '../../utils/emailjs';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const PHONE_PATTERN = /^[+()\d\s-]{7,20}$/;

export const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const submittedRef = useRef(false);

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
        subject: z.string().min(1, t('validation.selectRequired')),
        message: z.string().trim().min(10, t('validation.messageMin')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    try {
      await sendEmail('contact', {
        from_name: values.name,
        reply_to: values.email || values.phone,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        message: values.message,
        source: 'contact-page',
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

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormFeedback
        state={feedback}
        onReset={() => {
          setFeedback('idle');
        }}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-name" label={t('contact.name')} error={errors.name?.message} required>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder={t('contact.namePlaceholder')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={errors.name ? inputErrorClasses : inputClasses}
            {...register('name')}
          />
        </FormField>

        <FormField id="contact-phone" label={t('contact.phone')} error={errors.phone?.message} required>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder={t('quote.form.phonePlaceholder')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            className={errors.phone ? inputErrorClasses : inputClasses}
            {...register('phone')}
          />
        </FormField>
      </div>

      <FormField
        id="contact-email"
        label={t('contact.email')}
        error={errors.email?.message}
        optionalLabel={t('common.optional')}
      >
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder={t('contact.emailPlaceholder')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={errors.email ? inputErrorClasses : inputClasses}
          {...register('email')}
        />
      </FormField>

      <FormField
        id="contact-subject"
        label={t('contact.subject')}
        error={errors.subject?.message}
        required
      >
        <select
          id="contact-subject"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          className={`${errors.subject ? inputErrorClasses : inputClasses} appearance-none bg-[length:1rem] pr-10`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
          }}
          {...register('subject')}
        >
          <option value="">{t('validation.selectRequired')}</option>
          <option value="finishing">{t('contact.subjectOptions.finishing')}</option>
          <option value="painting">{t('contact.subjectOptions.painting')}</option>
          <option value="construction">{t('contact.subjectOptions.construction')}</option>
          <option value="workforce">{t('contact.subjectOptions.workforce')}</option>
          <option value="other">{t('contact.subjectOptions.other')}</option>
        </select>
      </FormField>

      <FormField id="contact-message" label={t('contact.message')} error={errors.message?.message} required>
        <textarea
          id="contact-message"
          rows={5}
          placeholder={t('contact.messagePlaceholder')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${errors.message ? inputErrorClasses : inputClasses} resize-y`}
          {...register('message')}
        />
      </FormField>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PillButton type="submit" disabled={isSubmitting} icon={<Send className="h-4 w-4" />} iconPosition="left">
          {isSubmitting ? t('contact.submitting') : t('contact.submit')}
        </PillButton>

        <p className="text-xs text-slate-500">
          <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="font-semibold text-brand-navy underline">
            {COMPANY_INFO.phoneDisplay}
          </a>{' '}
          {t('contact.whatsappAlternative')}
        </p>
      </div>

      {isSubmitting ? (
        <p className="sr-only" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('contact.submitting')}
        </p>
      ) : null}
    </form>
  );
};
