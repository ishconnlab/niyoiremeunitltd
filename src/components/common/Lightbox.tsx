import React, { useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface LightboxItem {
  src: string;
  alt: string;
}

export interface LightboxProps {
  isOpen: boolean;
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  caption?: string;
}

/**
 * Accessible image viewer.
 *
 * The viewer owns the current index so navigation can never drift out of sync
 * with the thumbnail strip, and focus is trapped inside the dialog while it is
 * open.
 */
export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  items,
  currentIndex,
  onClose,
  onIndexChange,
  caption,
}) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const total = items.length;
  const safeIndex = total > 0 ? ((currentIndex % total) + total) % total : 0;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      onIndexChange(((index % total) + total) % total);
    },
    [onIndexChange, total]
  );

  const next = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const previous = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previous();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      restoreFocusRef.current?.focus?.();
    };
  }, [isOpen, next, previous, onClose]);

  if (!isOpen || total === 0) return null;

  const active = items[safeIndex];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('common.closeGallery')}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4"
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label={t('common.closeGallery')}
        className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-white transition-colors hover:bg-brand-orange sm:right-4 sm:top-4"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>

      <div className="absolute top-4 left-4 sm:left-6 z-10 text-white max-w-[60vw]">
        {caption ? (
          <h3 className="text-base sm:text-lg font-semibold truncate">{caption}</h3>
        ) : null}
        <p className="text-xs text-slate-300 mt-1">
          {t('common.galleryImageAlt', { index: safeIndex + 1, total })}
        </p>
      </div>

      <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
        <img
          src={active.src}
          alt={active.alt}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
        />

        {total > 1 ? (
          <>
            <button
              onClick={previous}
              aria-label={t('common.previousImage')}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800/90 text-white transition-colors hover:bg-brand-orange sm:-left-14"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </button>
            <button
              onClick={next}
              aria-label={t('common.nextImage')}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800/90 text-white transition-colors hover:bg-brand-orange sm:-right-14"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-full overflow-x-auto px-4 py-2 bg-slate-900/70 rounded-xl border border-slate-800">
          {items.map((item, index) => (
            <button
              key={item.src}
              onClick={() => onIndexChange(index)}
              aria-label={t('common.galleryImageAlt', { index: index + 1, total })}
              aria-current={index === safeIndex}
              className={`relative h-11 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                index === safeIndex
                  ? 'border-brand-orange'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={item.src} alt="" aria-hidden="true" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
