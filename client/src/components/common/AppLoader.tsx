import React from 'react';

import { COMPANY_INFO } from '../../data/company';

/**
 * Branded loader shown while a route chunk is still downloading.
 *
 * It mirrors the boot splash that ships inside `index.html`, so the handover
 * from the static splash to the React tree never shows a blank white screen.
 */
export const AppLoader: React.FC = () => (
  <div
    className="fixed inset-0 z-50 overflow-hidden bg-brand-navy"
    role="status"
    aria-live="polite"
    aria-label={COMPANY_INFO.name}
  >
    <img
      src="/assets/brand/loader-blueprint.svg"
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full scale-105 object-cover opacity-50 blur-[3px]"
    />
    <div
      className="absolute inset-0 bg-gradient-to-b from-brand-navy/70 via-brand-navy/80 to-brand-navy/95"
      aria-hidden="true"
    />

    <div className="relative flex h-full w-full items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/15 bg-brand-navy/50 px-8 py-10 shadow-2xl backdrop-blur-md">
        <img
          src="/assets/brand/logo-mark.svg"
          alt={COMPANY_INFO.name}
          width={120}
          height={120}
          className="loader-mark h-20 w-20"
        />

        <p className="font-heading text-center text-xs font-bold uppercase tracking-[0.2em] text-white sm:text-sm">
          {COMPANY_INFO.name}
        </p>

        <p className="text-center text-sm font-semibold italic text-brand-orange">
          {COMPANY_INFO.sloganKinyarwanda}
        </p>

        <div className="relative h-[3px] w-44 overflow-hidden rounded-full bg-white/15">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-[loader-progress_1.15s_ease-in-out_infinite] rounded-full bg-brand-orange" />
        </div>
      </div>
    </div>
  </div>
);

