import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';

import { useServiceWorker } from '../../hooks/useServiceWorker';
import { PillButton } from './PillButton';

/** Banner shown when a newer version of the site is ready to be activated. */
export const UpdatePrompt: React.FC = () => {
  const { t } = useTranslation();
  const { needRefresh, applyUpdate } = useServiceWorker();

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[70] bg-brand-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <p className="text-sm font-bold">{t('pwa.updateTitle')}</p>
          <p className="text-xs text-slate-300">{t('pwa.updateBody')}</p>
        </div>
        <PillButton
          size="sm"
          variant="primary"
          icon={<RefreshCw className="w-4 h-4" />}
          iconPosition="left"
          onClick={applyUpdate}
        >
          {t('pwa.updateCta')}
        </PillButton>
      </div>
    </div>
  );
};

