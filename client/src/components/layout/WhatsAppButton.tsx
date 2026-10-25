import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Home,
  HardHat,
  PaintRoller,
  Building2,
  X,
  type LucideIcon,
} from 'lucide-react';

import { COMPANY_INFO } from '../../data/company';
import { SERVICE_CATEGORY_IDS } from '../../data/company';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface TopicMeta {
  icon: LucideIcon;
  /** Tailwind classes for the round icon chip, per topic. */
  chip: string;
}

const TOPIC_META: Record<string, TopicMeta> = {
  finishing: { icon: Home, chip: 'bg-brand-orange/10 text-brand-orange' },
  painting: { icon: PaintRoller, chip: 'bg-sky-50 text-sky-600' },
  construction: { icon: Building2, chip: 'bg-brand-navy/10 text-brand-navy' },
  workforce: { icon: HardHat, chip: 'bg-amber-50 text-amber-600' },
};

/**
 * Floating WhatsApp entry point.
 * Every topic opens WhatsApp with a pre-filled message, so the visitor never
 * reaches a dead end.
 */
export const WhatsAppButton: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t('whatsapp.chatTitle')}
          className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="relative overflow-hidden bg-brand-navy px-4 pb-5 pt-4 text-white">
            <div className="absolute inset-0 bg-grid-pattern-dark opacity-60" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                  <WhatsAppIcon className="h-6 w-6" />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-brand-navy bg-emerald-400"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h2 className="font-heading text-base font-black leading-tight">
                    {t('whatsapp.chatTitle')}
                  </h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    {t('whatsapp.online')} &middot; {t('whatsapp.office')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label={t('common.closeMenu')}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="px-4 py-4">
            <p className="text-xs leading-relaxed text-slate-600">{t('whatsapp.chatBody')}</p>

            <ul className="mt-3 flex flex-col gap-2">
              {SERVICE_CATEGORY_IDS.map((id) => {
                const meta = TOPIC_META[id];
                const Icon = meta.icon;

                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openWhatsApp(t(`whatsapp.${id}`))}
                      className="group flex min-h-11 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-brand-orange/40 hover:bg-brand-orange/5"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.chip}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-sm font-semibold text-slate-800">
                        {t(`services.items.${id}.shortLabel`)}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand-orange"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => openWhatsApp(t('whatsapp.defaultMessage'))}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t('whatsapp.chatCta')}
            </button>
          </div>
        </div>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={t('whatsapp.chatTitle')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl ring-4 ring-emerald-600/15 transition-colors hover:bg-emerald-700"
      >
        <span
          className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-orange"
          aria-hidden="true"
        />
        <WhatsAppIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

