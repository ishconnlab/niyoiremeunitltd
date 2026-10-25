import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './i18n';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root was not found in index.html.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Hand the screen over from the static boot splash to the React tree.
 *
 * The splash is removed after two animation frames, i.e. once the browser has
 * painted the first frame of the app, so the visitor never sees a white
 * screen. The React fallback for lazy routes mirrors the splash, which keeps
 * the transition seamless on slow connections.
 */
const revealApp = () => {
  document.body.classList.add('app-ready');

  const loader = document.getElementById('app-loader');
  if (!loader) return;

  loader.classList.add('is-hidden');
  window.setTimeout(() => loader.remove(), 500);
};

window.requestAnimationFrame(() => window.requestAnimationFrame(revealApp));

