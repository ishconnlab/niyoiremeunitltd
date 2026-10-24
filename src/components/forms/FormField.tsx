import React from 'react';

export const inputClasses =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30';

export const inputErrorClasses =
  'w-full rounded-xl border border-red-400 bg-red-50/40 px-4 py-3 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25';

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  required,
  optionalLabel,
  hint,
  children,
  className,
}) => (
  <div className={className}>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">
      {label}
      {required ? (
        <span className="ml-1 text-brand-orange" aria-hidden="true">
          *
        </span>
      ) : optionalLabel ? (
        <span className="ml-2 text-xs font-normal text-slate-400">({optionalLabel})</span>
      ) : null}
    </label>

    {children}

    {hint && !error ? (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
        {hint}
      </p>
    ) : null}

    {error ? (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
        {error}
      </p>
    ) : null}
  </div>
);

