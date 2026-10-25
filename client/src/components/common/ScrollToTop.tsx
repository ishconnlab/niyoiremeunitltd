import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets the scroll position on navigation and honours in-page anchors.
 * Smooth scrolling is disabled when the visitor prefers reduced motion.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [pathname, hash]);

  return null;
};

