import { useCallback, useEffect, useState } from 'react';

export interface ServiceWorkerState {
  /** True when a new version is waiting to be activated. */
  needRefresh: boolean;
  /** True when the device is currently offline. */
  isOffline: boolean;
  /** True once a cached version of the site is ready for offline use. */
  offlineReady: boolean;
  /** Activates the waiting worker and reloads the page. */
  applyUpdate: () => void;
}

const isServiceWorkerEnabled = (): boolean => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  // During development the service worker would cache stale bundles, so it is
  // opt-in there and always on for production builds.
  return import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === 'true';
};

export function useServiceWorker(): ServiceWorkerState {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isServiceWorkerEnabled()) return;

    let cancelled = false;

    const trackWorker = (worker: ServiceWorker, registration: ServiceWorkerRegistration) => {
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            if (!cancelled) setNeedRefresh(true);
          } else {
            if (!cancelled) setOfflineReady(true);
          }
        }
      });

      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        if (!cancelled) setNeedRefresh(true);
      }

      void registration;
    };

    const register = async () => {
      try {
        // Honour the deployment base path so the worker can be hosted in a
        // sub-directory as well as at the domain root.
        const base = import.meta.env.BASE_URL || '/';
        const registration = await navigator.serviceWorker.register(`${base}sw.js`, {
          scope: base,
          // Never serve a stale copy of the worker script itself â€” a cached
          // worker file is the most common reason an update never lands.
          updateViaCache: 'none',
        });

        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(registration.waiting);
          setNeedRefresh(true);
        }

        if (registration.installing) {
          trackWorker(registration.installing, registration);
        }

        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (installing) trackWorker(installing, registration);
        });

        // Ask the browser to look for a newer worker as soon as the page loads.
        void registration.update().catch(() => undefined);

        // Re-check for updates when the tab regains focus.
        const handleVisibility = () => {
          if (document.visibilityState === 'visible') {
            void registration.update().catch(() => undefined);
          }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => document.removeEventListener('visibilitychange', handleVisibility);
      } catch {
        return undefined;
      }
    };

    let cleanup: (() => void) | undefined;
    void register().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const applyUpdate = useCallback(() => {
    const worker = waitingWorker;
    if (!worker) {
      window.location.reload();
      return;
    }

    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') {
        window.location.reload();
      }
    });

    worker.postMessage({ type: 'SKIP_WAITING' });
  }, [waitingWorker]);

  return { needRefresh, isOffline, offlineReady, applyUpdate };
}

