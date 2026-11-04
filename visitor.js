(() => {
  'use strict';

  const HOSTED = 'https://gtaanakin.103.161.35.238.sslip.io';
  const SECTIONS = [
    ['#home', 'home'],
    ['#mission', 'mission'],
    ['#characters', 'characters'],
    ['#routes', 'routes'],
    ['#map', 'map'],
    ['#local-map', 'local-map'],
    ['#tokenomics', 'tokenomics'],
    ['#community', 'community']
  ];

  function origin() {
    const host = location.hostname.toLowerCase();
    if (
      host === 'gtaanakin.xyz' ||
      host === 'www.gtaanakin.xyz' ||
      host === '127.0.0.1' ||
      host === 'localhost'
    ) {
      return HOSTED;
    }
    return '';
  }

  function refused() {
    if (navigator.globalPrivacyControl) return true;
    const dnt = navigator.doNotTrack;
    return dnt === '1' || dnt === 'yes';
  }

  if (refused() || /\/dashboard\/?$/.test(location.pathname)) return;

  const api = origin();
  if (!api && location.protocol === 'file:') return;

  let latestSection = 'home';
  let pageViewSent = false;

  function fields() {
    const params = new URLSearchParams(location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined
    };
  }

  function payload(type, eventId, click) {
    const body = {
      type,
      eventId,
      path: location.pathname + location.search,
      section: latestSection,
      referrer: document.referrer,
      ...fields()
    };
    if (click) body.click = click;
    return body;
  }

  function post(route, body) {
    return fetch((api || '') + route, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      credentials: api ? 'include' : 'same-origin',
      cache: 'no-store',
      keepalive: true
    }).then((response) => response.ok).catch(() => false);
  }

  function noteSection(section) {
    if (!section || section === latestSection) return;
    latestSection = section;
    if (!pageViewSent) return;
    post('/api/analytics/collect', payload('section', crypto.randomUUID()));
  }

  function trackClick(click) {
    post('/api/analytics/collect', payload('click', crypto.randomUUID(), click));
  }

  let heartbeatId = crypto.randomUUID();
  let timer = 0;

  function beat() {
    if (document.visibilityState !== 'visible') return;
    const id = heartbeatId;
    post('/api/analytics/heartbeat', payload('heartbeat', id)).then((ok) => {
      if (ok) heartbeatId = crypto.randomUUID();
    });
  }

  function arm() {
    window.clearInterval(timer);
    if (document.visibilityState !== 'visible') return;
    timer = window.setInterval(beat, 30000);
  }

  pageViewSent = true;
  const pageId = crypto.randomUUID();
  post('/api/analytics/collect', payload('pageview', pageId)).then((ok) => {
    if (!ok) post('/api/analytics/collect', payload('pageview', pageId));
    if (document.visibilityState === 'visible') beat();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      beat();
      arm();
    } else {
      window.clearInterval(timer);
    }
  });
  if (document.visibilityState === 'visible') arm();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;
        noteSection(entry.target.getAttribute('data-section'));
      });
    }, { threshold: [0.45] });
    SECTIONS.forEach(([selector, name]) => {
      const node = document.querySelector(selector);
      if (!node) return;
      node.setAttribute('data-section', name);
      observer.observe(node);
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const copy = target.closest('[data-copy-contract]');
    if (copy && !copy.disabled) {
      trackClick('copy');
      return;
    }
    const social = target.closest('[data-social]');
    if (social && (social.dataset.social === 'telegram' || social.dataset.social === 'x')) {
      trackClick(social.dataset.social);
      return;
    }
    if (target.closest('.character-card')) {
      trackClick('character');
      return;
    }
    if (target.closest('.route-card')) {
      trackClick('route');
      return;
    }
    if (target.closest('.destination-chip, .map-pin, .local-pin')) {
      trackClick('destination');
    }
  });
})();
