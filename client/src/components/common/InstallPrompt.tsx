import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Share, X } from 'lucide-react';

import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { PillButton } from './PillButton';

/** Delay before the toast appears, so it never competes with first paint. */
const SHOW_DELAY_MS = 10_000;

/**
 * First-visit installation toast.
 *
 * It only appears when a real installation path exists (a captured
 * `beforeinstallprompt`, or iOS where the manual Share â†’ Add to Home Screen
 * flow is available), after a short delay, and never while the visitor has
 * dismissed it inside the cooldown window. The permanent footer button stays
 * available regardless.
 */
export const InstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const {
    canInstall,
    isInstalled,
    isIos,
    isDismissed,
    promptInstall,
    dismiss,
  } = useInstallPrompt();

  const [visible, setVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  const eligible = !isInstalled && !isDismissed && (canInstall || isIos);

  useEffect(() => {
    if (!eligible) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [eligible]);

  if (!eligible || !visible) return null;

  const handleInstall = async () => {
    if (isIos && !canInstall) {
      setShowIosHelp(true);
      return;
    }

    const outcome = await promptInstall();
    if (outcome !== 'unavailable') {
      dismiss();
    }
  };

  return (
    <div
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 z-50 sm:bottom-24 sm:left-auto sm:right-6 sm:max-w-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading font-black text-brand-navy">
              {showIosHelp ? t('pwa.installIosTitle') : t('pwa.installTitle')}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {showIosHelp ? t('pwa.installIosBody') : t('pwa.installBody')}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t('common.dismiss')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {showIosHelp ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              <Share className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              {t('pwa.installIosShare')}
            </span>
          ) : (
            <PillButton
              size="sm"
              icon={<Download className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => {
                void handleInstall();
              }}
            >
              {t('pwa.installCta')}
            </PillButton>
          )}
          <PillButton size="sm" variant="ghost" onClick={dismiss}>
            {t('pwa.installDismiss')}
          </PillButton>
        </div>
      </div>
    </div>
  );
};

