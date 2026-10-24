import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, Phone, MessageSquare } from 'lucide-react';

import { COMPANY_INFO } from '../../data/company';

export type FeedbackState = 'idle' | 'not-configured' | 'success' | 'error';

export interface FormFeedbackProps {
  state: FeedbackState;
  successBody?: string;
  onReset?: () => void;
}

const panelClasses =
  'rounded-2xl border p-5 text-sm leading-relaxed';

/**
 * Shared feedback panel for the enquiry forms.
 * A success message is only ever shown after EmailJS confirmed delivery.
 */
export const FormFeedback: React.FC<FormFeedbackProps> = ({ state, successBody, onReset }) => {
  const { t } = useTranslation();

  if (state === 'idle') return null;

  if (state === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`${panelClasses} border-emerald-200 bg-emerald-50 text-emerald-900`}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="font-bold">{t('common.submitSuccessTitle')}</p>
            <p className="mt-1">{successBody ?? t('common.submitSuccessBody')}</p>
            {onReset ? (
              <button
                type="button"
                onClick={onReset}
                className="mt-3 inline-flex min-h-9 items-center text-xs font-bold underline transition-opacity hover:opacity-70"
              >
                {t('common.sendAnother')}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'not-configured') {
    return (
      <div role="status" className={`${panelClasses} border-amber-300 bg-amber-50 text-amber-950`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <div>
            <p className="font-bold">{t('common.notConfiguredTitle')}</p>
            <p className="mt-1">{t('common.notConfiguredBody')}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="inline-flex items-center gap-1.5 underline transition-opacity hover:opacity-70"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {COMPANY_INFO.phoneDisplay}
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline transition-opacity hover:opacity-70"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                {t('common.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="alert" className={`${panelClasses} border-red-300 bg-red-50 text-red-900`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
        <div>
          <p className="font-bold">{t('common.submitFailedTitle')}</p>
          <p className="mt-1">{t('common.submitFailedBody')}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center gap-1.5 underline transition-opacity hover:opacity-70"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline transition-opacity hover:opacity-70"
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              {t('common.whatsapp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

