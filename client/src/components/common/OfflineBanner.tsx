import React from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff } from 'lucide-react';

import { useServiceWorker } from '../../hooks/useServiceWorker';

/** Persistent notice shown while the device has no network connection. */
export const OfflineBanner: React.FC = () => {
  const { t } = useTranslation();
  const { isOffline } = useServiceWorker();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-400 text-slate-900 text-sm font-medium"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-bold">{t('pwa.offlineTitle')}</strong> ” {t('pwa.offlineBody')}
        </span>
      </div>
    </div>
  );
};

