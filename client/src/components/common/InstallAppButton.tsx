import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Download, Share } from 'lucide-react';

import { useInstallPrompt } from '../../hooks/useInstallPrompt';

/**
 * Permanent "Install NIYO IREME App" footer button.
 *
 * Unlike the first-visit toast, this button is always available. It invokes the
 * real native install prompt when the browser supports it, shows short manual
 * instructions on iOS, and reflects the installed state once the app is added
 * to the home screen. It never reports a false success.
 */
export const InstallAppButton: React.FC = () => {
  const { t } = useTranslation();
  const { canInstall, isInstalled, isIos, promptInstall } = useInstallPrompt();
  const [showIosHelp, setShowIosHelp] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200">
        <Check className="h-4 w-4 text-brand-orange" aria-hidden="true" />
        {t('pwa.installInstalled')}
      </span>
    );
  }

  const handleClick = async () => {
    if (canInstall) {
      await promptInstall();
      return;
    }

    // No native prompt: reveal the manual route (iOS Share sheet or a generic
    // hint) instead of pretending installation succeeded.
    setShowIosHelp(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => {
          void handleClick();
        }}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-orange bg-brand-orange/10 px-4 py-2.5 text-sm font-bold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {t('pwa.installFooterCta')}
      </button>

      {showIosHelp ? (
        <p
          role="status"
          className="inline-flex items-center gap-2 text-xs text-slate-300"
        >
          <Share className="h-3.5 w-3.5 shrink-0 text-brand-orange" aria-hidden="true" />
          {isIos ? t('pwa.installIosBody') : t('pwa.installBody')}
        </p>
      ) : null}
    </div>
  );
};

