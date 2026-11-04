(() => {
  'use strict';
  const root = document.getElementById('page-loader');
  if (!root) return;
  const fill = root.querySelector('.page-loader-fill');
  const label = root.querySelector('.page-loader-pct');
  let progress = 0;
  let settled = false;
  let done = false;

  const setProgress = (value) => {
    progress = Math.max(progress, Math.min(100, value));
    const rounded = Math.round(progress);
    if (fill) fill.style.width = `${progress}%`;
    if (label) label.textContent = `${rounded}%`;
    root.setAttribute('aria-valuenow', String(rounded));
  };

  const finish = () => {
    if (done) return;
    done = true;
    setProgress(100);
    document.documentElement.classList.add('is-loaded');
    document.documentElement.classList.remove('is-loading');
    window.setTimeout(() => {
      root.setAttribute('hidden', '');
      root.setAttribute('aria-busy', 'false');
    }, 420);
  };

  const markReady = () => {
    if (settled) return;
    settled = true;
    setProgress(100);
    window.setTimeout(finish, 180);
  };

  const sources = [
    matchMedia('(max-width:700px)').matches
      ? 'assets/images/hero-mobile.webp'
      : 'assets/images/hero-desktop.webp',
    'assets/images/grand-theft-anakin-vi.webp',
    'assets/images/logo-square.webp'
  ];

  let loaded = 0;
  const bump = () => {
    loaded += 1;
    setProgress(12 + (loaded / sources.length) * 78);
    if (loaded >= sources.length) markReady();
  };

  sources.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = bump;
    img.onerror = bump;
    img.src = src;
  });

  setProgress(8);
  document.addEventListener('DOMContentLoaded', () => setProgress(Math.max(progress, 35)));
  window.addEventListener('load', () => setProgress(Math.max(progress, 92)));
  window.setTimeout(markReady, 7000);
})();
