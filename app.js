(() => {
  'use strict';
  const data = window.GTA_STORY;
  const config = window.GTA_CONFIG || {};
  const rawAddress = typeof config.contractAddress === 'string' ? config.contractAddress.trim() : '';
  const validAddress = /^0x[0-9a-fA-F]{40}$/.test(rawAddress);
  document.querySelectorAll('[data-token-value]').forEach(node => {
    const key = node.dataset.tokenValue;
    const raw = typeof config[key] === 'string' ? config[key].trim() : '';
    node.textContent = key === 'contractAddress' ? (validAddress ? rawAddress : (raw ? 'Invalid address — check configuration' : 'Not provided')) : (raw || 'To be announced');
  });
  const filled = (key) => typeof config[key] === 'string' && config[key].trim();
  const tokenDetailsReady = validAddress && filled('totalSupply') && filled('buySellTax') && (filled('ownership') || filled('lpLocked'));
  const pendingNote = document.querySelector('.tokenomics-note');
  if (pendingNote) pendingNote.hidden = Boolean(tokenDetailsReady);
  function verifiedSocialUrl(value, kind) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value.trim());
      const hosts = kind === 'telegram' ? ['t.me','telegram.me'] : ['x.com','twitter.com'];
      return url.protocol === 'https:' && hosts.includes(url.hostname.toLowerCase()) && url.pathname.length > 1 && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  }
  document.querySelectorAll('[data-social]').forEach(link => {
    const kind = link.dataset.social, url = verifiedSocialUrl(config[kind === 'x' ? 'xUrl' : 'telegramUrl'], kind);
    if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.removeAttribute('aria-disabled'); link.title = `Open ${kind === 'x' ? 'X' : 'Telegram'}`; }
  });
  document.querySelectorAll('[data-copy-contract]').forEach(button => {
    button.disabled = !validAddress;
    if (!validAddress) return;
    button.title = 'Copy the contract address';
    button.addEventListener('click', async () => {
      const label = button.querySelector('span'); const original = label.textContent;
      try {
        let copied = false;
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          try { await navigator.clipboard.writeText(rawAddress); copied = true; } catch { /* Try the compatibility path below. */ }
        }
        if (!copied) {
          const field = document.createElement('textarea');
          field.value = rawAddress; field.readOnly = true; field.setAttribute('aria-hidden', 'true');
          field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
          document.body.append(field); field.select();
          try { copied = document.execCommand('copy'); } finally { field.remove(); button.focus(); }
        }
        if (!copied) throw new Error('Clipboard unavailable');
        label.textContent = 'Copied!'; document.querySelector('#copy-status').textContent = 'Contract address copied.';
      } catch {
        label.textContent = 'Copy failed'; document.querySelector('#copy-status').textContent = 'Copy failed. Select the address in tokenomics and copy it manually.';
      }
      window.setTimeout(() => { label.textContent = original; }, 2200);
    });
  });
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const element = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text != null) el.textContent = text; return el; };
  const image = (src, alt, lazy = true) => { const el = document.createElement('img'); el.src = src; el.alt = alt; el.width = 1672; el.height = 941; el.decoding = 'async'; if (lazy) { el.loading = 'lazy'; el.setAttribute('fetchpriority', 'low'); } return el; };
  const dialog = $('#detail-dialog'), dialogImage = $('#dialog-image'), title = $('#dialog-title'), kicker = $('#dialog-kicker'), text = $('#dialog-text'), outcome = $('#dialog-outcome'), outcomeText = $('#outcome-text'), outcomeButton = $('#outcome-button');
  let lastTrigger = null;
  function openDetail(item, type, trigger) {
    lastTrigger = trigger;
    kicker.textContent = type === 'route' ? 'MISSION ROUTE' : type === 'character' ? 'MEET THE CREW' : 'MISSION LOCATION';
    title.textContent = type === 'location' ? item.title : item.name;
    text.textContent = type === 'character' ? item.bio : item.story;
    dialogImage.src = item.image;
    dialogImage.alt = type === 'location' ? `${item.name} destination artwork` : `${item.name} artwork`;
    const gallery = $('#scene-gallery'), thumbs = $('#gallery-thumbs'), position = $('#gallery-position');
    thumbs.replaceChildren();
    const scenes = type === 'location' && Array.isArray(item.gallery) ? item.gallery : [];
    gallery.hidden = scenes.length < 2;
    if (scenes.length >= 2) {
      const setScene = (index) => {
        dialogImage.src = scenes[index].src;
        dialogImage.alt = scenes[index].alt;
        position.textContent = `${index + 1} / ${scenes.length}`;
        [...thumbs.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      };
      scenes.forEach((scene, index) => {
        const button = element('button', 'scene-thumb'); button.type = 'button';
        button.setAttribute('aria-label', `Show ${item.name} image ${index + 1} of ${scenes.length}`);
        button.append(image(scene.src, '')); button.addEventListener('click', () => setScene(index)); thumbs.append(button);
      });
      setScene(0);
    }
    outcome.hidden = true; outcomeText.textContent = ''; outcomeButton.hidden = type !== 'route';
    outcomeButton.onclick = () => { dialogImage.src = item.outcomeImage; dialogImage.alt = `${item.name} outcome artwork`; outcomeText.textContent = item.outcome; outcome.hidden = false; outcomeButton.hidden = true; };
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    $('#dialog-close').focus();
  }
  $('#dialog-close').addEventListener('click', () => dialog.close());
  $('#dialog-back').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  data.characters.forEach(item => {
    const button = element('button', 'character-card'); button.type = 'button'; button.setAttribute('aria-label', `Learn about ${item.name}`);
    const img = image(item.image, ''); const info = element('span', 'character-info'), icon = element('span', 'character-icon', item.icon), words = element('span');
    icon.setAttribute('aria-hidden','true'); words.append(element('span','character-name',item.name), element('span','character-role',item.role)); info.append(icon,words); button.append(img,info);
    button.addEventListener('click', () => openDetail(item,'character',button)); $('#character-grid').append(button);
  });
  data.routes.forEach(item => {
    const button = element('button','route-card'); button.type = 'button'; button.setAttribute('aria-label', `Explore ${item.name}`);
    const info = element('span','route-info'), icon = element('span','route-icon',item.icon), words = element('span'), arrow = element('span','route-arrow','›');
    icon.setAttribute('aria-hidden','true'); arrow.setAttribute('aria-hidden','true'); words.append(element('span','route-title',item.name), element('span','route-desc',item.description)); info.append(icon,words,arrow); button.append(image(item.image,''),info);
    button.addEventListener('click', () => openDetail(item,'route',button)); $('#route-grid').append(button);
  });
  function renderMap(items,pinsSelector,listSelector) {
    const pins = $(pinsSelector), list = $(listSelector);
    items.forEach(item => {
      const pin = element('button','map-pin'); pin.type = 'button'; pin.style.left = `${item.x}%`; pin.style.top = `${item.y}%`; pin.setAttribute('aria-label',`Explore ${item.name}`);
      const dot = element('span','pin-dot'); dot.setAttribute('aria-hidden','true'); const label = element('span','pin-label',item.name); label.setAttribute('aria-hidden','true'); pin.append(dot,label); pin.addEventListener('click',() => openDetail(item,'location',pin)); pins.append(pin);
      const itemButton = element('button','',item.name); itemButton.type = 'button'; itemButton.addEventListener('click',() => openDetail(item,'location',itemButton)); list.append(itemButton);
    });
  }
  renderMap(data.galactic,'#galactic-pins','#galactic-list'); renderMap(data.local,'#local-pins','#local-list');
  const menu = $('.menu-toggle'), nav = $('#main-nav');
  function setMenu(open) { menu.setAttribute('aria-expanded',String(open)); nav.classList.toggle('open',open); }
  menu.addEventListener('click',() => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click',e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown',e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });
  if ('IntersectionObserver' in window) {
    const links = [...nav.querySelectorAll('a')];
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { links.forEach(link => { const active = link.getAttribute('href') === `#${entry.target.id}`; link.classList.toggle('active',active); if(active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); } }); }, {rootMargin:'-30% 0px -60% 0px'});
    links.forEach(link => { const target = $(link.getAttribute('href')); if (target) observer.observe(target); });
  }
})();
