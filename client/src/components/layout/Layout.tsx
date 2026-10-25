import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Header } from './Header';
import { PreFooterBand } from './PreFooterBand';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { InstallPrompt } from '../common/InstallPrompt';
import { UpdatePrompt } from '../common/UpdatePrompt';
import { OfflineBanner } from '../common/OfflineBanner';
import { ScrollToTop } from '../common/ScrollToTop';

export const Layout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-brand-orange focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
      >
        {t('common.skipToContent')}
      </a>

      <UpdatePrompt />
      <Header />
      <OfflineBanner />

      <main id="main-content" className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      <PreFooterBand />
      <Footer />
      <WhatsAppButton />
      <InstallPrompt />
      <ScrollToTop />
    </div>
  );
};

