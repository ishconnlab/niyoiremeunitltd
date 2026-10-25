import React from 'react';

interface CraneHookProps {
  className?: string;
}

/** Decorative crane hook â€” original site decoration, kept as a pure ornament. */
export const CraneHook: React.FC<CraneHookProps> = ({ className = 'w-16 h-28' }) => {
  return (
    <div className={`pointer-events-none select-none flex flex-col items-center ${className}`}>
      {/* Hanging cables */}
      <div className="w-1 bg-slate-700 h-6" />

      {/* Pulley block (orange with hazard lines) */}
      <div className="w-12 h-14 rounded-md bg-brand-orange border-2 border-slate-900 shadow-md flex flex-col items-center justify-between p-1 relative">
        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
        </div>
        <div className="w-full flex justify-around">
          <span className="w-1 h-2 bg-slate-900" />
          <span className="w-1 h-2 bg-slate-900" />
          <span className="w-1 h-2 bg-slate-900" />
        </div>
      </div>

      {/* Heavy iron hook */}
      <svg
        viewBox="0 0 64 64"
        className="w-10 h-12 text-slate-800 -mt-1 drop-shadow-md"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M30 4 C30 2, 34 2, 34 4 L34 16 C34 18, 38 20, 42 24 C48 30, 48 38, 42 44 C36 50, 26 50, 20 44 C14 38, 14 30, 20 24 C22 22, 24 22, 25 24 C26 26, 25 28, 23 30 C19 34, 19 40, 23 44 C27 48, 35 48, 39 44 C43 40, 43 34, 39 30 C35 26, 30 24, 30 18 Z" />
      </svg>
    </div>
  );
};

