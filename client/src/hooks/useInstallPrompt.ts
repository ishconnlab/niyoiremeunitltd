import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

export interface InstallPromptState {
  /** True when the browser has offered a native install prompt. */
  canInstall: boolean;
  /** True when the app is already running installed/standalone. */
  isInstalled: boolean;
  /** True on iOS/iPadOS where the native prompt is unavailable. */
  isIos: boolean;
  /** True once the visitor dismissed our toast within the cooldown window. */
  isDismissed: boolean;
  /** Trigger the native install prompt (no-op on unsupported browsers). */
  promptInstall: () => Promise<InstallOutcome>;
  /** Record a dismissal and start the cooldown. */
  dismiss: () => void;
}

const DISMISS_KEY = 'niyoireme.installDismissedAt';
/** Dismissals are remembered for this long before the toast may return. */
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

/* ------------------------------------------------------------------ *
 * A tiny external store so the toast and the permanent footer button
 * share one install state and one captured `beforeinstallprompt` event.
 * ------------------------------------------------------------------ */

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
let ios = false;
let dismissed = readDismissed();
let listenersBound = false;
const subscribers = new Set<() => void>();

function readDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const at = Number.parseInt(raw, 10);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function detectIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const ipad =
    /Macintosh/.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || ipad;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const displayStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return displayStandalone || iosStandalone;
}

const emit = () => subscribers.forEach((notify) => notify());

function setInstalled(next: boolean) {
  installed = next;
  emit();
}

function setDeferred(event: BeforeInstallPromptEvent | null) {
  deferredPrompt = event;
  emit();
}

function bindListeners() {
  if (listenersBound || typeof window === 'undefined') return;
  listenersBound = true;

  installed = detectStandalone();
  ios = detectIos();

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    setDeferred(event as BeforeInstallPromptEvent);
  });

  window.addEventListener('appinstalled', () => {
    setInstalled(true);
    setDeferred(null);
  });

  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', (event) => {
    setInstalled(event.matches);
  });
}

function subscribe(notify: () => void) {
  bindListeners();
  subscribers.add(notify);
  return () => subscribers.delete(notify);
}

let snapshot = {
  canInstall: deferredPrompt !== null,
  isInstalled: installed,
  isIos: ios,
  isDismissed: dismissed,
};

function getSnapshot() {
  const canInstall = deferredPrompt !== null;
  if (
    snapshot.canInstall === canInstall &&
    snapshot.isInstalled === installed &&
    snapshot.isIos === ios &&
    snapshot.isDismissed === dismissed
  ) {
    return snapshot;
  }
  snapshot = { canInstall, isInstalled: installed, isIos: ios, isDismissed: dismissed };
  return snapshot;
}

const SERVER_SNAPSHOT = {
  canInstall: false,
  isInstalled: false,
  isIos: false,
  isDismissed: false,
};

function markDismissed() {
  dismissed = true;
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* Storage may be unavailable â€” the dismissal simply lasts for this session. */
  }
  emit();
}

/**
 * Shared PWA installation state.
 *
 * Both the first-visit toast and the permanent footer button subscribe here, so
 * the captured `beforeinstallprompt` event is used exactly once and the two
 * surfaces never disagree or double-prompt.
 */
export function useInstallPrompt(): InstallPromptState {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const [ready, setReady] = useState(false);

  // Re-read dismissal on mount so a fresh tab respects the cooldown.
  useEffect(() => {
    const wasDismissed = readDismissed();
    if (wasDismissed !== dismissed) {
      dismissed = wasDismissed;
      emit();
    }
    setReady(true);
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    if (!deferredPrompt) return 'unavailable';

    const event = deferredPrompt;
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === 'accepted') {
      setInstalled(true);
      setDeferred(null);
    }
    return choice.outcome;
  }, []);

  return {
    canInstall: ready && state.canInstall,
    isInstalled: state.isInstalled,
    isIos: state.isIos,
    isDismissed: state.isDismissed,
    promptInstall,
    dismiss: markDismissed,
  };
}

